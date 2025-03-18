"use client";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;

  prompt(): Promise<void>;
}

const ActivityPage = () => {
  return (
    <>
      <div className="text-white flex-1 flex flex-col pt-0">Activity page</div>
    </>
  );
};

export default ActivityPage;
