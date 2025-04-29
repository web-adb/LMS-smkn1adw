import Link from "next/link";
import { StatsOverview } from "./StatsCard";
import { ManagementCard } from "./ManagementCard";
import { QuizBankCard } from "./QuizBankCard";
import { GradingCard } from "./GradingCard";

export default function DashboardGuru() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Stats Overview */}
        <StatsOverview />

        {/* Main Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ManagementCard />
          <QuizBankCard />
          <GradingCard />
        </div>
      </div>
    </div>
  );
}