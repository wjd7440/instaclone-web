import PropTypes from "prop-types";
import { gql, useQuery, useMutation } from "@apollo/client";
import {
  faBookmark,
  faComment,
  faHeart,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FatText } from "../shared";
import { faHeart as SolidHeart } from "@fortawesome/free-solid-svg-icons";
import Avatar from "../Avatar";
import Comments from "./Comments";

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      ok
      error
    }
  }
`;

const PhotoContainer = styled.div`
  background-color: white;
  border: 1px solid ${(props) => props.theme.borderColor};
  margin-bottom: 20px;
  max-width: 615px;
`;

const PhotoHeader = styled.div`
  padding: 15px;
  display: flex;
  align-items: center;
`;

const Username = styled(FatText)`
  margin-left: 15px;
`;

const PhotoFile = styled.img`
  max-width: 100%;
`;

const PhotoData = styled.div`
  padding: 15px;
`;

const PhotoActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  div {
    display: flex;
    align-items: center;
  }
`;

const PhotoAction = styled.div`
  margin-right: 10px;
  cursor: pointer;
`;

const Likes = styled(FatText)`
  margin-top: 15px;
  display: block;
`;

function Photo({
  id,
  user,
  file,
  isLiked,
  likes,
  caption,
  commentNumber,
  comments,
}) {
  const updateToggleLike = (cache, result) => {
    const {
      data: {
        toggleLike: { ok },
      },
    } = result;
    if (ok) {
      const photoId = `Photo:${id}`;
      cache.modify({
        id: photoId,
        fields: {
          isLiked(prev) {
            return !prev;
          },
          likes(prev) {
            if (isLiked) {
              return prev - 1;
            }
            return prev + 1;
          },
        },
      });
    }
  };
  const [toggleLikeMutation, { loading }] = useMutation(TOGGLE_LIKE_MUTATION, {
    variables: { id },
    update: updateToggleLike,
  });
  return (
    <PhotoContainer key={id}>
      <PhotoHeader>
        <Link to={`/users/${user.username}`}>
          <Avatar lg url={user.avatar} />
        </Link>
        <Link to={`/users/${user.username}`}>
          <Username>{user.username}</Username>
        </Link>
      </PhotoHeader>
      <PhotoFile src={file} />
      <PhotoData>
        <PhotoActions>
          <div>
            <PhotoAction onClick={toggleLikeMutation}>
              <FontAwesomeIcon
                style={{ color: isLiked ? "tomato" : "inherit" }}
                size={"2x"}
                icon={isLiked ? SolidHeart : faHeart}
              />
            </PhotoAction>
            <PhotoAction>
              <FontAwesomeIcon size={"2x"} icon={faComment} />
            </PhotoAction>
            <PhotoAction>
              <FontAwesomeIcon size={"2x"} icon={faPaperPlane} />
            </PhotoAction>
          </div>
          <div>
            <FontAwesomeIcon size={"2x"} icon={faBookmark} />
          </div>
        </PhotoActions>
        <Likes>{likes === 1 ? "1 like" : `${likes} likes`}</Likes>
        <Comments
          photoId={id}
          author={user.username}
          caption={caption}
          commentNumber={commentNumber}
          comments={comments}
        />
      </PhotoData>
    </PhotoContainer>
  );
}

Photo.propTypes = {
  id: PropTypes.number.isRequired,
  user: PropTypes.shape({
    avatar: PropTypes.string,
    username: PropTypes.string.isRequired,
  }),
  caption: PropTypes.string,
  file: PropTypes.string.isRequired,
  isLiked: PropTypes.bool.isRequired,
  likes: PropTypes.number.isRequired,
  commentNumber: PropTypes.number.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      user: PropTypes.shape({
        avatar: PropTypes.string,
        username: PropTypes.string.isRequired,
      }),
      payload: PropTypes.string.isRequired,
      isMine: PropTypes.bool.isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ),
};
export default Photo;
