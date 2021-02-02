import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import SingleComment from './SingleComment';

function ReplyComment(props) {

    const [ChildCommentNumber, setChildCommentNumber] = useState(0);
    const [OpenReplyComments, setOpenReplyComments] = useState(false);

    useEffect(() => {
        let commentNumber = 0;
        props.CommentLists.map((comment) => {
            if (comment.responseTo === props.parentCommentId) {
                commentNumber++;
            }
        })

        setChildCommentNumber(commentNumber);

    }, [props.CommentLists]); 
    // commentNumber 값이 바뀔 때마다 실행 → CommentLists가 바뀔 때마다 재 실행

    /* postId == videoId */
    let renderReplyComment = (parentCommentId) =>
        props.CommentLists.map((comment, index) => (
            <React.Fragment key={comment._id}>
                {/* "responseTo"가 없는 1depth는 화면 출력 X */}
                {comment.responseTo === parentCommentId && (
                    <div style={{ width: "80%", marginLeft: "40px" }}>
                        <SingleComment
                            comment={comment}
                            postId={props.videoId}
                            refreshFunction={props.refreshFunction} />
                        <ReplyComment
                            CommentLists={props.CommentLists}
                            postId={props.videoId}
                            parentCommentId={comment._id}
                            refreshFunction={props.refreshFunction} />
                    </div>
                )}
            </React.Fragment>
        ))
    
    const onHandleChange = () => {
        setOpenReplyComments(!OpenReplyComments);
    }

    return (
        <div>
            {ChildCommentNumber > 0 &&
                <p style={{ fontSize: '14px', margin: 0, color: 'gray' }}
                    onClick={onHandleChange}> {/*onClick */}
                    View {ChildCommentNumber} more Comment(s)
                </p>
            }
            
            {OpenReplyComments &&
                renderReplyComment(props.parentCommentId)
            }
        </div>
    )
}

export default ReplyComment
