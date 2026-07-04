import { defineComponent, type PropType, type VNodeChild } from "vue";

/**
 * Renders a raw VNodeChild (e.g. the result of an IconRenderer call) inside
 * a template. Usage: <VNodeRenderer :nodes="renderIcon(icon, size, cls)" />
 */
export const VNodeRenderer = defineComponent({
  name: "VNodeRenderer",
  props: {
    nodes: {
      type: [Object, Array, String, Number] as PropType<VNodeChild>,
      default: null,
    },
  },
  setup(props) {
    return () => props.nodes;
  },
});

export default VNodeRenderer;
