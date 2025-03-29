import { Skeleton } from "@/components/ui/skeleton";

export function QuizSkeleton() {
  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="bg-gray-50 p-2 border-b flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-32" />
      </div>
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-[40px] px-4 py-3 text-left">
              <Skeleton className="h-4 w-4" />
            </th>
            <th className="w-[120px] px-4 py-3 text-left">
              <Skeleton className="h-4 w-24" />
            </th>
            <th className="px-4 py-3 text-left">
              <Skeleton className="h-4 w-32" />
            </th>
            <th className="px-4 py-3 text-left">
              <Skeleton className="h-4 w-32" />
            </th>
            <th className="w-[180px] px-4 py-3 text-left">
              <Skeleton className="h-4 w-32" />
            </th>
            <th className="px-4 py-3 text-left">
              <Skeleton className="h-4 w-24" />
            </th>
            <th className="px-4 py-3 text-left">
              <Skeleton className="h-4 w-16" />
            </th>
            <th className="px-4 py-3 text-right">
              <Skeleton className="h-4 w-8 ml-auto" />
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, i) => (
            <tr key={i} className="border-b">
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-4" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-full" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-full" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-full" />
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-6 w-12 rounded-full" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-8" />
              </td>
              <td className="px-4 py-3 text-right">
                <Skeleton className="h-8 w-8 ml-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function QuizRowSkeleton() {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-4" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-full" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-full" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-full" />
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-6 w-12 rounded-full" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-8" />
      </td>
      <td className="px-4 py-3 text-right">
        <Skeleton className="h-8 w-8 ml-auto" />
      </td>
    </tr>
  );
}