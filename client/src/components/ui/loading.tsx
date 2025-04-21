import { Skeleton } from "@/components/ui/skeleton";

export function ArticleCardSkeleton() {
  return (
    <div className="bg-neutral-light rounded-lg overflow-hidden shadow-md">
      <Skeleton className="w-full h-48" />
      <div className="p-6">
        <Skeleton className="h-6 w-24 mb-3" />
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        <div className="flex items-center">
          <Skeleton className="h-6 w-6 rounded-full mr-2" />
          <Skeleton className="h-4 w-20 mr-4" />
          <Skeleton className="h-4 w-24 mr-4" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

export function ArticleDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Skeleton className="h-12 w-3/4 mb-4" />
      <div className="flex items-center mb-6">
        <Skeleton className="h-10 w-10 rounded-full mr-3" />
        <div>
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="w-full aspect-video mb-8 rounded-lg" />
      <Skeleton className="h-5 w-full mb-2" />
      <Skeleton className="h-5 w-full mb-2" />
      <Skeleton className="h-5 w-3/4 mb-4" />
      <Skeleton className="h-5 w-full mb-2" />
      <Skeleton className="h-5 w-full mb-2" />
      <Skeleton className="h-5 w-5/6 mb-4" />
    </div>
  );
}

export function CategoryGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-neutral-light rounded-lg p-6 h-full shadow-sm">
          <Skeleton className="w-14 h-14 rounded-full mb-4" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-5/6 mb-4" />
          <Skeleton className="h-5 w-32" />
        </div>
      ))}
    </div>
  );
}
