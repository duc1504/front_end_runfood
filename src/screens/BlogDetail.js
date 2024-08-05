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
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`https://backend-runfood.vercel.app/blog/${id}`);
        setPost(response.data.data);
        setloading(false);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setloading(false);
      }
    };

    fetchPost();
  }, [id]);


  const formattedDate = post ? format(new Date(post.date), 'dd/MM/yyyy') : '';

  return (
    <>
      <Header />
      {loading ? (
        <div className="loaderblog">
          <div className="loaderblog-inner"></div>
        </div>
      ) : (
        <div className="blog-detail-container">
          <div className="blog-detail-content">
            <h1>{post.title}</h1>
            <div className="blog-meta">
              <span className="blog-author">By: <strong>{post.author}</strong></span>
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
      )}
      <Footer />
    </>
  );
};

export default BlogDetail;





