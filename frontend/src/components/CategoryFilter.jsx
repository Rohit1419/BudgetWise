import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CategoryFilter({
  categories,
  onSelectCategory,
  selectedCategory,
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        variant={selectedCategory === "all" ? "default" : "outline"}
        onClick={() => onSelectCategory("all")}
        className="text-xs"
      >
        All
      </Button>

      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onSelectCategory(category)}
          className="text-xs"
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Button>
      ))}
    </div>
  );
}
