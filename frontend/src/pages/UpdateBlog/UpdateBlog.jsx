import { useState, useEffect } from "react";
import { getBlogById, updateBlog } from "../../api/internal";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./UpdateBlog.module.css";
import { useSelector } from "react-redux";
import TextInput from "../../components/TextInput/TextInput";

function UpdateBlog() {
  const navigate = useNavigate();
  const params = useParams();
  const blogId = params.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState("");

  const author = useSelector((state) => state.user._id);

  const getPhoto = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setPhoto(reader.result);
    };
  };

  const updateHandler = async () => {
    let data;

    if (photo.includes("http")) {
      data = {
        author,
        title,
        content,
        blogId,
      };
    } else {
      data = {
        author,
        title,
        content,
        photo,
        blogId,
      };
    }

    try {
      const response = await updateBlog(data);

      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.error("Blog update failed:", error);
      alert(
        error.response?.data?.message ||
          "Blog update nahi ho saka. Dobara koshish karein."
      );
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function getBlogDetails() {
      try {
        const response = await getBlogById(blogId);

        if (response.status === 200 && !cancelled) {
          setTitle(response.data.blog.title);
          setContent(response.data.blog.content);
          setPhoto(response.data.blog.photo);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Blog details load nahi ho sake:", error);
        }
      }
    }

    if (blogId) {
      getBlogDetails();
    }

    return () => {
      cancelled = true;
    };
  }, [blogId]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>Edit your blog</div>

      <TextInput
        type="text"
        name="title"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "60%" }}
      />

      <textarea
        className={styles.content}
        placeholder="your content goes here..."
        maxLength={400}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className={styles.photoPrompt}>
        <p>Choose a photo</p>

        <input
          type="file"
          name="photo"
          id="photo"
          accept="image/jpeg, image/png"
          onChange={getPhoto}
        />

        {photo && (
          <img
            src={photo}
            width={150}
            height={150}
            alt="Blog preview"
          />
        )}
      </div>

      <button className={styles.update} onClick={updateHandler}>
        Update
      </button>
    </div>
  );
}

export default UpdateBlog;