import React from 'react';
import { truncateText } from '../../utils/helpers';

const SearchResults = ({ results, onItemClick }) => {
  const { categories, courses, lessons } = results;

  const ResultSection = ({ title, items, type }) => (
    items.length > 0 && (
      <div className="p-4 border-b last:border-b-0">
        <h3 className="text-sm font-semibold text-gray-500 mb-2">{title}</h3>
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemClick(type, item)}
              className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
            >
              <h4 className="font-medium text-gray-800">{item.title}</h4>
              {item.shortDescription && (
                <p className="text-sm text-gray-600">
                  {truncateText(item.shortDescription, 80)}
                </p>
              )}
              {item.description && (
                <p className="text-sm text-gray-600">
                  {truncateText(item.description, 80)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  );

  return (
    <div className="divide-y divide-gray-200">
      {categories.length === 0 && courses.length === 0 && lessons.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No results found
        </div>
      ) : (
        <>
          <ResultSection title="Categories" items={categories} type="category" />
          <ResultSection title="Courses" items={courses} type="course" />
          <ResultSection title="Lessons" items={lessons} type="lesson" />
        </>
      )}
    </div>
  );
};

export default SearchResults;