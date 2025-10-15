import React from "react";
import { Link } from "gatsby";
import { PostCardProps } from "./types";
import * as styles from "./PostCard.module.scss";

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <article className={styles.postCard}>
      <Link to={`/posts/${post.slug}`} className={styles.title}>
        {post.title}
      </Link>
      <p className={styles.date}>{post.date}</p>
      {Array.isArray(post.tags) && post.tags.length > 0 && (
        <div className={styles.tags}>
          {post.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};
