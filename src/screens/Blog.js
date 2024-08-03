import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.css";
import "../styles/blogstyle.css";
import Header from "../components/header";
import Footer from "../components/footer";
import axios from "axios";

const Blog = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await axios.get("https://backend-runfood.vercel.app/blog");
      if (response.status === 200) {
        setPosts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  };

  // Chọn bài viết nổi bật (bài đầu tiên hoặc một bài viết đặc biệt)
  const featuredPost = posts.length > 0 ? posts[0] : null;
  const otherPosts = posts.slice(1);

  return (
    <>
      <Header />
      <div className="blog-container">
        <h1 className="text-center my-5">Blog Ẩm Thực</h1>
        {featuredPost && (
          <div className="featured-post">
            <div className="featured-image-container">
              <img src={featuredPost.image} alt={featuredPost.title} className="featured-image" />
            </div>
            <div className="featured-content">
              <h2>{featuredPost.title}</h2>
              <p>{featuredPost.excerpt}</p>
              <a href={`/blog/${featuredPost._id}`} className="read-more">
                Đọc tiếp
              </a>
            </div>
          </div>
        )}
        <div className="posts">
          {otherPosts.map((post) => (
            <div key={post._id} className="post-card">
              <img src={post.image} alt={post.title} className="post-image" />
              <div className="post-content">
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <a href={`/blog/${post._id}`} className="read-more">
                  Đọc tiếp
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Blog;
