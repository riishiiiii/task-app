import React, { useState } from "react";

const CommentItem = ({ comment, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);
  
    return (
      <div className="bg-black bg-opacity-30 p-4 rounded-lg">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold">{comment.created_by_username}</p>
            <p className="text-sm text-gray-400">{new Date(comment.created_at).toLocaleString()}</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-white"
            >
              ⋮
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <button
                  onClick={() => {
                    onDelete(comment.comment_id);
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="mt-2">{comment.comment}</p>
      </div>
    );
  };

export default CommentItem;