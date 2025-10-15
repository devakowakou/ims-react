import React from 'react';
import { Card, CardHeader, CardContent } from './ui/card';

export const SkeletonCard = () => {
  return (
    <Card className="animate-pulse">
      <CardHeader className="space-y-2">
        <div className="h-4 bg-muted rounded w-1/3"></div>
        <div className="h-3 bg-muted rounded w-1/2"></div>
      </CardHeader>
      <CardContent>
        <div className="h-8 bg-muted rounded w-1/4 mb-2"></div>
        <div className="h-3 bg-muted rounded w-1/3"></div>
      </CardContent>
    </Card>
  );
};

export const SkeletonTable = ({ rows = 3 }) => {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="h-10 bg-muted rounded flex-1"></div>
          <div className="h-10 bg-muted rounded w-24"></div>
          <div className="h-10 bg-muted rounded w-24"></div>
        </div>
      ))}
    </div>
  );
};

export const SkeletonChart = () => {
  return (
    <div className="animate-pulse">
      <div className="h-[300px] bg-muted rounded flex items-end justify-around p-4 space-x-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-muted-foreground/20 rounded-t w-full"
            style={{ height: `${Math.random() * 60 + 40}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
};
