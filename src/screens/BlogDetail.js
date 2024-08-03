import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { format } from 'date-fns';
import Header from "../components/header";
import Footer from "../components/footer";
import "@fortawesome/fontawesome-free/css/all.css";
import "../styles/blogdetailstyle.css";

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`https://backend-runfood.vercel.app/blog/${id}`);
        setPost(response.data.data);
      } catch (error) {
        console.error("Error fetching blog post:", error);
      }
    };

    fetchPost();
  }, [id]);

  if (!post) return <p>Loading...</p>;
  const formattedDate = format(new Date(post.date), 'dd/MM/yyyy');

  return (
    <>
      <Header />
      <div className="blog-detail-container">
        <div className="blog-detail-content">
          <h1>{post.title}</h1>
          <div className="blog-meta">
            <span className="blog-author">By {post.author}</span>
            <span className="blog-date">{formattedDate}</span>
          </div>
          <div className="blog-image-container">
            <img src={post.image} alt={post.title} className="blog-detail-image" />
          </div>
          <div className="blog-body">
            <p>{post.content}</p>
          </div>
          <a href="/blog" className="back-to-blog">
            &larr; Back to Blog
          </a>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogDetail;





