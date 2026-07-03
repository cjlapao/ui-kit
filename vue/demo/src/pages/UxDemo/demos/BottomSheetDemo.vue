<script setup lang="ts">
import { defineComponent, h, ref, type PropType } from "vue";
import { v4 as uuidv4 } from "uuid";
import PlaygroundSection from "../PlaygroundSection.vue";
import { Button, useBottomSheet } from "@cjlapao/ui-kit-vue";
import notificationService from "../mocks/NotificationService";
import { GLOBAL_NOTIFICATION_CHANNEL } from "../constants";

interface FeedbackSubmission {
  score: number;
  note: string;
}

const feedbackRatingScale = Array.from({ length: 11 }, (_, index) => index);

const FeedbackSheetContent = defineComponent({
  name: "FeedbackSheetContent",
  props: {
    onSubmit: {
      type: Function as PropType<(submission: FeedbackSubmission) => void>,
      required: true,
    },
  },
  setup(props) {
    const score = ref<number | null>(null);
    const note = ref("");

    return () =>
      h("div", { class: "space-y-5" }, [
        h("div", { class: "space-y-1.5" }, [
          h(
            "p",
            { class: "text-base font-semibold text-slate-800" },
            "How likely are you to recommend us to a colleague?",
          ),
          h(
            "p",
            { class: "text-sm text-slate-500" },
            "0 means not at all likely and 10 is extremely likely.",
          ),
        ]),
        h(
          "div",
          { class: "flex flex-wrap gap-2" },
          feedbackRatingScale.map((value) =>
            h(
              "button",
              {
                key: value,
                type: "button",
                class: `h-10 w-10 rounded-full border text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                  score.value === value
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600"
                }`,
                onClick: () => {
                  score.value = value;
                },
              },
              String(value),
            ),
          ),
        ),
        score.value !== null
          ? h("div", { class: "space-y-2" }, [
              h(
                "label",
                {
                  class: "text-sm font-medium text-slate-700",
                  for: "feedback-notes",
                },
                "Tell us a bit more",
              ),
              h("textarea", {
                id: "feedback-notes",
                class:
                  "h-28 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100",
                placeholder: "What made you choose that score?",
                value: note.value,
                onInput: (event: Event) => {
                  note.value = (event.target as HTMLTextAreaElement).value;
                },
              }),
            ])
          : null,
        h(
          "div",
          {
            class:
              "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
          },
          [
            h(
              "p",
              { class: "text-xs text-slate-500" },
              "We read every response and use it to guide our roadmap.",
            ),
            h(
              Button,
              {
                size: "sm",
                color: "blue",
                disabled: score.value === null,
                onClick: () => {
                  if (score.value === null) {
                    return;
                  }
                  props.onSubmit({
                    score: score.value,
                    note: note.value.trim(),
                  });
                },
              },
              () => "Finish",
            ),
          ],
        ),
      ]);
  },
});

const { presentSheet } = useBottomSheet();

const handleFeedbackSubmit = (submission: FeedbackSubmission) => {
  notificationService.createNotification({
    id: uuidv4(),
    message: `Thanks for rating us ${submission.score}/10`,
    details: submission.note || "No additional comments provided.",
    autoClose: true,
    dismissible: true,
    showAsToast: true,
    channel: GLOBAL_NOTIFICATION_CHANNEL,
  });
};

const openFeedbackSheet = () => {
  presentSheet({
    title: "Share your feedback",
    description:
      "Trigger the bottom sheet anywhere through the global controller.",
    content: ({ dismiss }) =>
      h(FeedbackSheetContent, {
        onSubmit: (submission: FeedbackSubmission) => {
          handleFeedbackSubmit(submission);
          dismiss();
        },
      }),
    actions: ({ dismiss }) =>
      h(
        Button,
        { variant: "ghost", color: "slate", size: "md", onClick: dismiss },
        () => "Not now",
      ),
  });
};
</script>

<template>
  <PlaygroundSection
    title="Feedback Prompt"
    label="[BottomSheet]"
    description="Trigger the universal bottom sheet controller with any body/actions."
  >
    <template #controls>
      <div class="space-y-4">
        <p class="text-sm text-neutral-500 dark:text-neutral-300">
          Press the preview button to open the live bottom sheet overlay.
        </p>
        <Button variant="soft" color="blue" @click="openFeedbackSheet">
          Preview Feedback Sheet
        </Button>
      </div>
    </template>
    <template #preview>
      <div class="space-y-3 text-sm text-neutral-500 dark:text-neutral-300">
        <p>
          The preview lives outside of this panel. Use the button in the
          controls column to open the overlay.
        </p>
        <p>
          The sheet adapts to screen size and supports custom actions/body
          content.
        </p>
      </div>
    </template>
  </PlaygroundSection>
</template>
