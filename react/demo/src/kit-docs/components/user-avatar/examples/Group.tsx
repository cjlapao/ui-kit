import { UserAvatar } from "@cjlapao/ui-kit";

const PEOPLE = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson"];

/**
 * Grouping, PrimeVue-style: stack avatars with a negative gap and a ring so
 * each one bites into the next, and cap the pile with a `label` avatar.
 */
export default function Group() {
  return (
    <div className="flex -space-x-3">
      {PEOPLE.map((name) => (
        <UserAvatar
          key={name}
          size="lg"
          user={{ name }}
          className="ring-2 ring-white dark:ring-neutral-900"
        />
      ))}
      <UserAvatar
        size="lg"
        label="+2"
        className="ring-2 ring-white dark:ring-neutral-900"
      />
    </div>
  );
}
