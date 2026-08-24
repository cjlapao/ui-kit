import { useState } from "react";
import {
  Button,
  GlassBackground,
  Input,
  Panel,
  Toggle,
} from "@cjlapao/ui-kit";

export default function SignInForm() {
  const [remembered, setRemembered] = useState(true);

  return (
    <div className="relative h-96 w-full max-w-md overflow-hidden rounded-xl">
      <GlassBackground
        color="purple"
        colorSecondary="blue"
        colorDeep="indigo"
        direction="br"
        ambient
      >
        <div className="flex h-full items-center justify-center p-4">
          <div className="w-full max-w-sm">
            <Panel
              title="Sign in"
              variant="liquid-glass"
              corner="rounded-lg"
              glassOpacity="frosted"
              vibrancy="high"
            >
              <div className="space-y-3">
                <Input placeholder="Email" size="md" />
                <Input placeholder="Password" size="md" type="password" />
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    Remember me
                  </span>
                  <Toggle
                    size="sm"
                    color="blue"
                    checked={remembered}
                    onChange={(event) => setRemembered(event.target.checked)}
                  />
                </div>
                <Button fullWidth variant="solid" color="blue" size="md">
                  Continue
                </Button>
              </div>
            </Panel>
          </div>
        </div>
      </GlassBackground>
    </div>
  );
}
