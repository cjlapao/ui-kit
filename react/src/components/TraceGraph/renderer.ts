import { TRUE_COLOR_HEX } from "../chart/engine/theme";
import type { TraceScene, TracePoint, TracePositionedNode } from "../../../../common/traceGraph/model";
import { screenPoint, type TraceGraphViewport } from "../../../../common/traceGraph/camera";
import { tracePulseRadius } from "./effects";

export interface TracePaint {
  tone: string;
  text: string;
  selected: string | null;
  selectedEdge: string | null;
  focused: string | null;
  activeNodes: ReadonlySet<string>;
  activeEdges: ReadonlySet<string>;
  glow: "all" | "active" | "none";
  labels: boolean;
  sparkles: boolean;
  sparkleIntensity: number;
  sparkleSpeed: number;
  pulseScale: number;
  junctionGlowIntensity: number;
}
type Color = [number, number, number, number];
function color(tone: string | undefined, fallback: string, alpha = 1): Color {
  const hex = TRUE_COLOR_HEX[tone ?? fallback] ?? TRUE_COLOR_HEX.blue;
  return [parseInt(hex.slice(1, 3), 16) / 255, parseInt(hex.slice(3, 5), 16) / 255, parseInt(hex.slice(5, 7), 16) / 255, alpha];
}
const css = (c: Color) => `rgba(${c[0] * 255},${c[1] * 255},${c[2] * 255},${c[3]})`;
const lerp = (a: TracePoint, b: TracePoint, t: number) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });

const VERTEX = `#version 300 es
precision highp float;
in vec2 a_position; in vec2 a_previous; in vec2 a_offset;
in vec4 a_color; in float a_t; in float a_active;
uniform vec2 u_resolution; uniform vec3 u_view; uniform float u_mix;
uniform float u_time; uniform float u_dpr; uniform float u_points; uniform float u_halo;
out vec4 v_color; out float v_t; out float v_active; out float v_cross;
void main(){
 vec2 p=mix(a_previous,a_position,u_mix)*u_view.z+u_view.xy;
 p+=a_offset*(u_halo>.5?9.:1.2);
 gl_Position=vec4(p/u_resolution*vec2(2.,-2.)+vec2(-1.,1.),0.,1.);
 gl_PointSize=(u_halo>.5?(a_active>.5?64.:44.)*clamp(u_view.z,0.01,1.):(a_active>.5?30.:a_t>.5?22.:14.))*u_dpr;
 v_color=a_color; v_t=a_t; v_active=a_active;
 v_cross=sign(abs(a_offset.x)>abs(a_offset.y)?a_offset.x:a_offset.y);
}`;
const FRAGMENT = `#version 300 es
precision highp float;
in vec4 v_color; in float v_t; in float v_active; in float v_cross;
uniform float u_points; uniform float u_time; uniform float u_halo; uniform float u_activeGlow; uniform float u_junctionGlowIntensity;
out vec4 outColor;
void main(){
 float alpha=1.; vec3 rgb=v_color.rgb;
 if(u_halo>.5){
  if(u_activeGlow>.5 && v_active<.5) discard;
  float r=u_points>.5?length(gl_PointCoord-vec2(.5))*2.:abs(v_cross);
  alpha=exp(-r*r*5.)*(1.-smoothstep(.7,1.,r))*(u_points>.5?.46:.26);
  if(v_active>.5) alpha*=1.15+.25*sin(u_time*3.);
  if(u_points>.5) alpha=clamp(alpha*u_junctionGlowIntensity,0.,1.);
 }else if(u_points>.5){
  float r=length(gl_PointCoord-vec2(.5))*2.;
  float core=v_active>.5?.28:v_t>.5?.36:.58;
  alpha=1.-smoothstep(core-.08,core,r);
  if(v_t>.5) alpha=max(alpha,(1.-smoothstep(.08,.13,abs(r-.78)))*.8);
  if(v_active>.5){
   float pulse=fract(u_time*.65);
   alpha=max(alpha,(1.-smoothstep(.02,.11,abs(r-(.35+.55*pulse))))*(1.-pulse)*.65);
  }
 }else if(v_active>.5){
  float travel=fract(v_t*4.-u_time*.6);
  alpha=.45+.55*pow(max(0.,1.-travel*3.),3.);
  rgb=mix(rgb,vec3(1.),pow(max(0.,1.-travel*5.),3.)*.55);
 }
 if(alpha<.01) discard;
 float opacity=v_color.a*alpha;
 outColor=vec4(rgb*opacity,opacity);
}`;

function createProgram(gl: WebGL2RenderingContext) {
  const shaders = [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER].map((type, i) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, i ? FRAGMENT : VERTEX); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { const error = gl.getShaderInfoLog(shader); gl.deleteShader(shader); throw new Error(error ?? "Trace shader compilation failed"); }
    return shader;
  });
  const program = gl.createProgram()!;
  shaders.forEach(shader => gl.attachShader(program, shader)); gl.linkProgram(program);
  shaders.forEach(shader => gl.deleteShader(shader));
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { gl.deleteProgram(program); throw new Error("Trace shader link failed"); }
  return program;
}

/** GPU geometry + a separate text/fallback canvas; no DOM per point or edge. */
export class TraceRenderer {
  private gl: WebGL2RenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private lineBuffer: WebGLBuffer | null = null;
  private nodeBuffer: WebGLBuffer | null = null;
  private lineCount = 0;
  private nodeCount = 0;
  private ctx: CanvasRenderingContext2D | null;
  private previous: TraceScene | undefined;
  private scene: TraceScene | undefined;
  private paint: TracePaint | undefined;
  private starts = new Map<string, TracePoint>();
  constructor(private canvas: HTMLCanvasElement, private overlay: HTMLCanvasElement, forceCanvas = false) {
    this.ctx = overlay.getContext("2d");
    if (!forceCanvas) try {
      this.gl = canvas.getContext("webgl2", { alpha: true, antialias: true, premultipliedAlpha: true });
      if (this.gl) {
        this.program = createProgram(this.gl);
        this.lineBuffer = this.gl.createBuffer(); this.nodeBuffer = this.gl.createBuffer();
      }
    } catch { this.gl = null; }
  }
  get backend() { return this.gl && this.program ? "webgl2" : "canvas2d"; }
  setScene(scene: TraceScene, paint: TracePaint, previous?: TraceScene) {
    this.scene = scene; this.paint = paint; this.previous = previous;
    const parents = new Map(scene.edges.map(edge => [edge.target, edge.source]));
    this.starts = new Map(scene.nodes.map(node => {
      const old = previous?.byId.get(node.id);
      const parent = parents.get(node.id);
      return [node.id, old ?? (parent ? previous?.byId.get(parent) : undefined) ?? node];
    }));
    const gl = this.gl;
    if (!gl || !this.program || gl.isContextLost()) return;
    const oldEdges = new Map(previous?.edges.map(edge => [edge.id, edge]) ?? []);
    const lines: number[] = [], dots: number[] = [];
    for (const edge of scene.edges) {
      const c = color(edge.tone, paint.tone, paint.selectedEdge === edge.id ? 1 : edge.back ? .3 : .65);
      const active = paint.activeEdges.has(edge.id) ? 1 : 0;
      const old = oldEdges.get(edge.id);
      for (let i = 1; i < edge.points.length; i++) {
        const a = edge.points[i - 1], b = edge.points[i], length = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        const nx = -(b.y - a.y) / length, ny = (b.x - a.x) / length;
        for (const [p, sign, t] of [[a, -1, i - 1], [a, 1, i - 1], [b, -1, i], [b, -1, i], [a, 1, i - 1], [b, 1, i]] as const) {
          const prev = old?.points[t] ?? previous?.byId.get(edge.source) ?? p;
          lines.push(p.x, p.y, prev.x, prev.y, nx * sign * (paint.selectedEdge === edge.id ? 2 : 1), ny * sign * (paint.selectedEdge === edge.id ? 2 : 1), ...c, t / 24, active);
        }
      }
    }
    for (const node of scene.nodes) {
      const c = color(node.tone ?? (node.status === "error" ? "rose" : node.status === "blocked" ? "amber" : undefined), paint.tone);
      const old = this.starts.get(node.id)!;
      dots.push(node.x, node.y, old.x, old.y, 0, 0, ...c, node.id === paint.selected || node.id === paint.focused ? 1 : 0, paint.activeNodes.has(node.id) ? 1 : 0);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.lineBuffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lines), gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.nodeBuffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dots), gl.DYNAMIC_DRAW);
    this.lineCount = lines.length / 12; this.nodeCount = dots.length / 12;
  }
  draw(view: TraceGraphViewport, width: number, height: number, time: number, mix = 1) {
    if (!this.scene || !this.paint || !this.ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2), ctx = this.ctx, paint = this.paint;
    for (const canvas of [this.canvas, this.overlay]) if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, width, height);
    const gl = this.gl, program = this.program;
    if (gl && program && !gl.isContextLost()) {
      gl.viewport(0, 0, this.canvas.width, this.canvas.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      // Shader output and browser compositing both use premultiplied alpha.
      // Multiplying again here darkens translucent halos, especially on white.
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.useProgram(program);
      const uniform = (name: string) => gl.getUniformLocation(program, name);
      gl.uniform2f(uniform("u_resolution"), width, height); gl.uniform3f(uniform("u_view"), view.x, view.y, view.zoom);
      gl.uniform1f(uniform("u_dpr"), dpr); gl.uniform1f(uniform("u_time"), time);
      gl.uniform1f(uniform("u_mix"), mix);
      gl.uniform1f(uniform("u_junctionGlowIntensity"), paint.junctionGlowIntensity);
      const draw = (buffer: WebGLBuffer | null, count: number, points: boolean) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        for (const [name, count, offset] of [["a_position", 2, 0], ["a_previous", 2, 2], ["a_offset", 2, 4], ["a_color", 4, 6], ["a_t", 1, 10], ["a_active", 1, 11]] as const) {
          const location = gl.getAttribLocation(program, name);
          if (location < 0) continue;
          gl.enableVertexAttribArray(location); gl.vertexAttribPointer(location, count, gl.FLOAT, false, 48, offset * 4);
        }
        gl.uniform1f(uniform("u_points"), points ? 1 : 0);
        gl.drawArrays(points ? gl.POINTS : gl.TRIANGLES, 0, count);
      };
      if (paint.glow !== "none") {
        gl.uniform1f(uniform("u_activeGlow"), paint.glow === "active" ? 1 : 0);
        gl.uniform1f(uniform("u_halo"), 1);
        draw(this.lineBuffer, this.lineCount, false); draw(this.nodeBuffer, this.nodeCount, true);
      }
      gl.uniform1f(uniform("u_halo"), 0);
      draw(this.lineBuffer, this.lineCount, false); draw(this.nodeBuffer, this.nodeCount, true);
    } else this.drawFallback(view, width, height, time, mix);
    if (paint.sparkles && paint.glow !== "none" && paint.sparkleIntensity > 0) this.drawSparkles(view, width, height, time, mix);
    // Screen-space label occupancy gives selected/focused nodes priority.
    const occupied: { x: number; y: number; width: number }[] = [];
    const labels = [...this.scene.nodes].sort((a, b) => Number(b.id === paint.selected || b.id === paint.focused) - Number(a.id === paint.selected || a.id === paint.focused));
    ctx.font = "12px Inter, system-ui, sans-serif"; ctx.fillStyle = paint.text;
    for (const node of labels) {
      const priority = node.id === paint.selected || node.id === paint.focused;
      if (!priority && (!paint.labels || view.zoom < .6)) continue;
      const p = screenPoint(lerp(this.starts.get(node.id) ?? node, node, mix), view);
      if (p.x < -40 || p.x > width || p.y < 0 || p.y > height) continue;
      const text = (node.label ?? node.id).slice(0, 80), textWidth = ctx.measureText(text).width;
      if (!priority && occupied.some(box => Math.abs(box.y - p.y) < 18 && p.x + 9 < box.x + box.width && p.x + 9 + textWidth > box.x)) continue;
      occupied.push({ x: p.x + 9, y: p.y, width: textWidth });
      ctx.fillText(text, p.x + 10, p.y - 10);
      if (occupied.length >= 160) break;
    }
  }
  private drawFallback(view: TraceGraphViewport, width: number, height: number, time: number, mix: number) {
    const ctx = this.ctx!, paint = this.paint!, scene = this.scene!;
    const oldEdges = new Map(this.previous?.edges.map(edge => [edge.id, edge]) ?? []);
    for (const edge of scene.edges) {
      const points = edge.points.map((p, i) => screenPoint(lerp(oldEdges.get(edge.id)?.points[i] ?? this.previous?.byId.get(edge.source) ?? p, p, mix), view));
      if (!points.some(p => p.x > -100 && p.x < width + 100 && p.y > -100 && p.y < height + 100)) continue;
      ctx.strokeStyle = css(color(edge.tone, paint.tone, .65)); ctx.lineWidth = paint.selectedEdge === edge.id ? 2.5 : 1.5;
      ctx.setLineDash(edge.back ? [3, 5] : []); ctx.beginPath(); points.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
      if (paint.glow === "all" || (paint.glow === "active" && paint.activeEdges.has(edge.id))) {
        ctx.save(); ctx.strokeStyle = css(color(edge.tone, paint.tone, .12));
        ctx.lineWidth = 7; ctx.shadowColor = css(color(edge.tone, paint.tone, .6)); ctx.shadowBlur = 12; ctx.stroke(); ctx.restore();
      }
      ctx.stroke(); ctx.setLineDash([]);
      if (paint.activeEdges.has(edge.id)) {
        const t = (time * .6 % 1) * 24, a = points[Math.floor(t)], b = points[Math.min(24, Math.floor(t) + 1)];
        const p = lerp(a, b, t % 1); ctx.save();
        if (paint.glow !== "none") { ctx.shadowColor = css(color(edge.tone, paint.tone)); ctx.shadowBlur = 14; }
        ctx.fillStyle = paint.glow !== "none" ? "#fff" : css(color(edge.tone, paint.tone)); ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    }
    for (const node of scene.nodes) {
      const p = screenPoint(lerp(this.starts.get(node.id) ?? node, node, mix), view);
      if (p.x < -30 || p.x > width + 30 || p.y < -30 || p.y > height + 30) continue;
      const c = color(node.tone ?? (node.status === "error" ? "rose" : node.status === "blocked" ? "amber" : undefined), paint.tone);
      if (paint.glow === "all" || (paint.glow === "active" && paint.activeNodes.has(node.id))) {
        const radius = tracePulseRadius(paint.activeNodes.has(node.id) ? 30 : 22, 1, view.zoom);
        const intensity = paint.junctionGlowIntensity;
        const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        halo.addColorStop(0, css([c[0], c[1], c[2], Math.min(1, .5 * intensity)])); halo.addColorStop(.35, css([c[0], c[1], c[2], Math.min(1, .16 * intensity)])); halo.addColorStop(1, css([c[0], c[1], c[2], 0]));
        ctx.fillStyle = halo; ctx.fillRect(p.x - radius, p.y - radius, radius * 2, radius * 2);
      }
      ctx.fillStyle = css(c); ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill();
      if (node.id === paint.selected || node.id === paint.focused || paint.activeNodes.has(node.id)) {
        const active = paint.activeNodes.has(node.id), phase = time * .65 % 1;
        ctx.strokeStyle = css([c[0], c[1], c[2], active ? 1 - phase : .9]); ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(p.x, p.y, active ? 6 + phase * 9 : 8, 0, Math.PI * 2); ctx.stroke();
      }
    }
  }
  /** Small active-only Canvas effects layer shared by GPU and fallback rendering. */
  private drawSparkles(view: TraceGraphViewport, width: number, height: number, time: number, mix: number) {
    const ctx = this.ctx!, paint = this.paint!, scene = this.scene!;
    const clock = time * paint.sparkleSpeed, strength = paint.sparkleIntensity;
    const flare = (p: TracePoint, c: Color, seed: number, size: number) => {
      if (p.x < -60 || p.x > width + 60 || p.y < -60 || p.y > height + 60) return;
      ctx.save();
      // Two soft circular waves replace directional rays. Both radius and blur
      // shrink with zoom so a dense overview never fills with oversized flares.
      for (let wave = 0; wave < 2 && size > .2; wave++) {
        const phase = ((clock * .7 + seed + wave * .5) % 1 + 1) % 1;
        // Hold the color through the expansion: the old quadratic fade made
        // the wave nearly invisible by the time it cleared the dot itself.
        const radius = size * (.45 + .55 * phase), alpha = Math.min(1, strength * 1.3) * (1 - phase) ** .65;
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        gradient.addColorStop(0, css([c[0], c[1], c[2], alpha * .4]));
        gradient.addColorStop(.55, css([c[0], c[1], c[2], alpha * .65]));
        gradient.addColorStop(.8, css([c[0], c[1], c[2], alpha]));
        gradient.addColorStop(1, css([c[0], c[1], c[2], 0]));
        ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(p.x, p.y, radius, 0, Math.PI * 2); ctx.fill();
      }
      const core = Math.min(3.8, size * .4);
      ctx.fillStyle = css(c); ctx.beginPath(); ctx.arc(p.x, p.y, core, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0; ctx.fillStyle = `rgba(255,255,255,${Math.min(1, strength * .95)})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, Math.min(1.8, core * .5), 0, Math.PI * 2); ctx.fill(); ctx.restore();
    };
    const oldEdges = new Map(this.previous?.edges.map(edge => [edge.id, edge]) ?? []);
    for (const edge of scene.edges) {
      if (!paint.activeEdges.has(edge.id)) continue;
      const points = edge.points, old = oldEdges.get(edge.id);
      for (let spark = 0; spark < 2; spark++) {
        const t = ((clock * .38 + spark * .5) % 1) * (points.length - 1), i = Math.floor(t);
        const at = (index: number) => lerp(old?.points[index] ?? this.previous?.byId.get(edge.source) ?? points[index], points[index], mix);
        const p = screenPoint(lerp(at(i), at(Math.min(i + 1, points.length - 1)), t - i), view);
        flare(p, color(edge.tone, paint.tone), spark * 2.7, tracePulseRadius(4, paint.pulseScale, view.zoom) * .65);
      }
    }
    for (const node of scene.nodes) if (paint.activeNodes.has(node.id)) {
      const seed = [...node.id].reduce((sum, char) => sum + char.charCodeAt(0), 0) * .13;
      flare(this.projected(node, view, mix), color(node.tone ?? (node.status === "error" ? "rose" : node.status === "blocked" ? "amber" : undefined), paint.tone), seed, tracePulseRadius(4, paint.pulseScale, view.zoom));
    }
  }
  projected(node: TracePositionedNode, view: TraceGraphViewport, mix = 1) { return screenPoint(lerp(this.starts.get(node.id) ?? node, node, mix), view); }
  dispose() {
    const gl = this.gl;
    if (gl) {
      if (!gl.isContextLost()) { gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); }
      gl.deleteBuffer(this.lineBuffer); gl.deleteBuffer(this.nodeBuffer); if (this.program) gl.deleteProgram(this.program);
    }
  }
}
