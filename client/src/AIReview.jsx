import React from "react";
import ReactMarkdown from "react-markdown";

const AIReview = ({ review }) => {
  if (!review) {
    return null; // show nothing if empty
  }

  return (
    <div className="p-4 bg-gray-100 rounded-xl shadow-md mt-4">
      <h2 className="text-lg font-bold mb-2"> AI Code Review</h2>
      <ReactMarkdown className="prose">{review}</ReactMarkdown>
    </div>
  );
};

export default AIReview;
