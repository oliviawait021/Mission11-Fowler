import { useEffect, useState } from "react";
import "./CategoryFilter.css";

function CategoryFilter({
  selectedCategories,
  setSelectedCategories,
}: {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://mission13backendfowler3.azurewebsites.net/bookstore/getbooktypes"
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);

  function handleCheckboxChange({ target }: { target: HTMLInputElement }) {
    const updatedCategories = selectedCategories.includes(target.value)
      ? selectedCategories.filter((c) => c !== target.value)
      : [...selectedCategories, target.value];

    setSelectedCategories(updatedCategories);
  }

  return (
    <div className="card p-3 mb-4">
      <h5 className="mb-3">
        <strong>Book Categories</strong>
      </h5>
      <hr />
      <div className="category-list">
        {categories.map((b) => (
          <div key={b} className="form-check w-100 text-start">
            <input
              type="checkbox"
              id={b}
              value={b}
              className="form-check-input"
              onChange={handleCheckboxChange}
            />
            <label htmlFor={b} className="form-check-label text-start">
              {b}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;
