"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { MessageCircle, Send, Reply } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Post {
  id: number;
  content: string;
  author: string;
  createdAt: string;
  replies?: Post[]; // Menambahkan fitur reply
}

export default function ForumPage() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null); // Menyimpan ID pesan yang sedang dibalas
  const [isLoading, setIsLoading] = useState(true); // State untuk loading indicator

  // Fetch posts from the API
  useEffect(() => {
    setIsLoading(true); // Set loading to true before fetching
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setIsLoading(false); // Set loading to false after fetching
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setIsLoading(false); // Set loading to false if there's an error
      });
  }, []);

  // Handle new post submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: newPost,
        author: user?.username || user?.primaryEmailAddress?.emailAddress,
        parentId: replyingTo, // Jika ini adalah reply, sertakan parentId
      }),
    });

    if (response.ok) {
      const newPostData = await response.json();
      if (replyingTo) {
        // Jika ini adalah reply, tambahkan ke replies dari post yang dituju
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === replyingTo
              ? { ...post, replies: [...(post.replies || []), newPostData] }
              : post
          )
        );
      } else {
        // Jika ini adalah post baru, tambahkan ke daftar posts
        setPosts([newPostData, ...posts]);
      }
      setNewPost("");
      setReplyingTo(null); // Reset reply state
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      {/* Judul Halaman */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <MessageCircle className="w-6 h-6 text-indigo-600 mr-2" />
        Forum Diskusi
      </h1>

      {/* Daftar Postingan */}
      <div className="flex-1 space-y-6 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-medium">
                    {post.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{post.author}</p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-700">{post.content}</p>

              {/* Tombol Reply */}
              <button
                onClick={() => setReplyingTo(post.id)}
                className="mt-2 flex items-center text-xs text-indigo-600 hover:text-indigo-700"
              >
                <Reply className="w-3 h-3 mr-1" />
                Reply
              </button>

              {/* Menampilkan Replies */}
              {post.replies && post.replies.length > 0 && (
                <div className="ml-6 mt-4 space-y-4">
                  {post.replies.map((reply) => (
                    <div key={reply.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">
                            {reply.author.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-700">{reply.author}</p>
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-700">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Form Chat di Bawah Layar */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 w-full">
        {replyingTo && (
          <div className="mb-2 text-sm text-gray-600">
            Replying to:{" "}
            <span className="font-medium">
              {posts.find((post) => post.id === replyingTo)?.author}
            </span>
            <button
              onClick={() => setReplyingTo(null)}
              className="ml-2 text-xs text-red-500 hover:text-red-600"
            >
              Cancel
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center space-x-4 w-full">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Ketik pesan Anda..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-none"
            rows={2}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}