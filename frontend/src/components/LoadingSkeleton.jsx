import React from 'react';

export const JobCardSkeleton = () => {
  return (
    <div className="glass-card p-6 rounded-2xl animate-pulse">
      <div className="h-6 bg-slate-800 rounded w-2/3 mb-4"></div>
      <div className="h-4 bg-slate-800 rounded w-1/2 mb-3"></div>
      <div className="h-4 bg-slate-800 rounded w-1/3 mb-6"></div>
      <div className="h-16 bg-slate-800 rounded w-full mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-slate-800 rounded w-1/4"></div>
        <div className="h-10 bg-slate-800 rounded w-1/3"></div>
      </div>
    </div>
  );
};

export const ProfileSkeleton = () => {
  return (
    <div className="glass-card p-8 rounded-2xl animate-pulse space-y-6">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-slate-800 rounded-full"></div>
        <div className="space-y-2 flex-1">
          <div className="h-6 bg-slate-800 rounded w-1/3"></div>
          <div className="h-4 bg-slate-800 rounded w-1/4"></div>
        </div>
      </div>
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="h-4 bg-slate-800 rounded w-full"></div>
        <div className="h-4 bg-slate-800 rounded w-5/6"></div>
        <div className="h-4 bg-slate-800 rounded w-2/3"></div>
      </div>
    </div>
  );
};

export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="glass-card p-6 rounded-2xl">
          <div className="h-4 bg-slate-800 rounded w-1/2 mb-3"></div>
          <div className="h-8 bg-slate-800 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );
};
