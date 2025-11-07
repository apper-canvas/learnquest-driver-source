import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import progressService from "@/services/api/progressService";
import Header from "@/components/organisms/Header";

export default function Layout() {
  const [totalStars, setTotalStars] = useState(0);
  const { isAuthenticated } = useSelector(state => state.user);

  useEffect(() => {
    const loadStars = async () => {
      if (isAuthenticated) {
        const progress = await progressService.getCurrentProgress();
        setTotalStars(progress?.total_stars_c || 0);
      }
    };
    loadStars();
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-background">
      <Header totalStars={totalStars} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet context={{ totalStars }} />
      </main>
    </div>
  );
};
