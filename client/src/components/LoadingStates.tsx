import { ComponentType } from "react";

export function withLoading<P extends object>(
    Component: ComponentType<P>
): ComponentType<P & { isLoading?: boolean }> {
    return function WithLoadingComponent({ isLoading, ...props }) {
        if (!isLoading) return <Component {...(props as P)} />;
        return (
            <div className="flex items-center justify-center p-12">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading data...</p>
                </div>
            </div>
        );
    };
}

export function SkeletonLoader() {
    return (
        <div className="space-y-4 w-full">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
        </div>
    );
}
