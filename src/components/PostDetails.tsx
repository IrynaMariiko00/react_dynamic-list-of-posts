import React, { useEffect, useState } from 'react';
import { Loader } from './Loader';
import { NewCommentForm } from './NewCommentForm';
import { Post } from '../types/Post';
import { Comment } from '../types/Comment';
import { deleteComment, getComments } from '../api/api';

type Props = {
  activePost: Post;
};

export const PostDetails: React.FC<Props> = ({ activePost }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isError, setIsError] = useState(false);
  const [isCommentFormVisible, setIsCommentFormVisible] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsCommentFormVisible(false);

    getComments(activePost.id)
      .then(setComments)
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, [activePost]);

  const handleDeleteComment = (commentId: number) => {
    setComments(commentsList =>
      commentsList.filter(comment => comment.id !== commentId),
    );

    deleteComment(commentId).then(() => {});
  };

  return (
    <div className="content" data-cy="PostDetails">
      <div className="content" data-cy="PostDetails">
        <div className="block">
          <h2 data-cy="PostTitle">
            {`#${activePost?.id}: ${activePost?.title}`}
          </h2>

          <p data-cy="PostBody">{activePost?.body}</p>
        </div>

        <div className="block">
          <Loader isLoading={isLoading} />

          {isError && (
            <div className="notification is-danger" data-cy="CommentsError">
              Something went wrong
            </div>
          )}

          {!isLoading && comments?.length === 0 && !isError && (
            <p className="title is-4" data-cy="NoCommentsMessage">
              No comments yet
            </p>
          )}
          {comments?.length > 0 && (
            <>
              <p className="title is-4">Comments:</p>
              {comments.map(comment => (
                <article
                  className="message is-small"
                  data-cy="Comment"
                  key={comment.id}
                >
                  <div className="message-header">
                    <a href={`mailto:${comment.email}`} data-cy="CommentAuthor">
                      {comment.name}
                    </a>
                    <button
                      data-cy="CommentDelete"
                      type="button"
                      className="delete is-small"
                      aria-label="delete"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      delete button
                    </button>
                  </div>

                  <div className="message-body" data-cy="CommentBody">
                    {comment.body}
                  </div>
                </article>
              ))}
            </>
          )}
          {!isLoading && (
            <button
              data-cy="WriteCommentButton"
              type="button"
              className="button is-link"
              style={{ display: isCommentFormVisible ? 'none' : 'block' }}
              onClick={() => setIsCommentFormVisible(true)}
            >
              Write a comment
            </button>
          )}
        </div>
        {isCommentFormVisible && <NewCommentForm />}
      </div>
    </div>
  );
};
