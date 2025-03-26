import { useState } from "react";
import HeaderBand from "../components/HeaderBand";
import CategoryFilter from "../components/CategoryFilter";
import BookList from "../components/BookList";

function BooksPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  return (
    <>
      <div className="container">
        <div className="row">
          <HeaderBand />
        </div>
        <div className="row">
          <div className="col-md-3">
            <CategoryFilter
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>
          <div className="col-md-9">
            <BookList selectedCategories={selectedCategories} />
          </div>
        </div>
      </div>
    </>
  );
}

export default BooksPage;
