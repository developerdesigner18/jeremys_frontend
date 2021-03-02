import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "../../assets/css/myStory.css";
import {
  getUserWithId,
  hideTheStory,
  getReviewOfFan,
  getReviewOfArtist,
  hideReview,
} from "../../actions/userActions";
import { getFollowing, getFollowers } from "../../actions/followActions";
import Pagination from "react-js-pagination";
import StarRatings from "react-star-ratings";

function MyStory(props) {
  var isMyStory = props.location.state.isMystory;
  const history = useHistory();
  const dispatch = useDispatch();

  const stateData = useSelector(state => state.user);
  const followData = useSelector(state => state.follow);

  const [userInfo, setUserInfo] = useState();
  const [following, setFollowing] = useState();
  const [followers, setFollowers] = useState();
  const [screenShot, setScreenShot] = useState();
  const [screenShotCounter, setScreenShotCounter] = useState(0);
  const [rightPart, setRightPart] = useState(props.location.state.pageNumber);
  const [journalDataTemp, setJournalData] = useState([
    {
      time: "121212",
      items: "asasasasa",
      orderTotal: "121",
      tips: "11",
      total: "123",
    },
    {
      time: "121212",
      items: "asasasasa",
      orderTotal: "121",
      tips: "11",
      total: "123",
    },
    {
      time: "121212",
      items: "asasasasa",
      orderTotal: "121",
      tips: "11",
      total: "123",
    },
    {
      time: "121212",
      items: "asasasasa",
      orderTotal: "121",
      tips: "11",
      total: "123",
    },
    {
      time: "121212",
      items: "asasasasa",
      orderTotal: "121",
      tips: "11",
      total: "123",
    },
    {
      time: "121212",
      items: "asasasasa",
      orderTotal: "121",
      tips: "11",
      total: "123",
    },
  ]);
  const [perPage, setperPage] = React.useState(5);
  const [perPageReview, setperPageReview] = React.useState(4);
  const [activePage, setactivePage] = useState(0);
  const [Offset, setOffset] = useState(0);

  const [reviewData, setReviewData] = useState([]);
  const [reviewDataName, setReviewDataName] = useState("");

  const [activeReviewPage, setactiveReviewPage] = useState(0);
  const [OffsetReview, setOffsetReview] = useState(0);

  useEffect(() => {
    dispatch(getUserWithId(props.location.state.userId));
    dispatch(getFollowing(props.location.state.userId));
    dispatch(getFollowers(props.location.state.userId));
    dispatch(getReviewOfFan(props.location.state.userId));
    dispatch(getReviewOfArtist(props.location.state.userId));
  }, []);
  useEffect(() => {
    if (stateData) {
      console.log("state data", stateData);
      if (stateData.userInfo) {
        setUserInfo(stateData.userInfo);
        var publicStory = stateData.userInfo.data.screenShots.filter(
          element => element.private == "0"
        );
        if (props.location.state.isMystory) {
          setScreenShot(stateData.userInfo.data.screenShots);
        } else {
          setScreenShot(publicStory);
        }
        if (stateData.userInfo.data.type === "Fan") {
          if (stateData.reviewOfFan) {
            setReviewDataName("artistId");
            if (props.location.state.isMystory) {
              setReviewData(stateData.reviewOfFan);
            } else {
              var publicFanReview = stateData.reviewOfFan.filter(
                element => element.hideByFan === false
              );
              setReviewData(publicFanReview);
            }
          }
        } else {
          if (stateData.reviewOfArtist) {
            setReviewDataName("fanId");
            if (props.location.state.isMystory) {
              setReviewData(stateData.reviewOfArtist);
            } else {
              var publicArtistReview = stateData.reviewOfArtist.filter(
                element => element.hideByArtist === false
              );
              setReviewData(publicArtistReview);
            }
          }
        }
      }
      if (stateData.updatedValue) {
        setUserInfo(stateData.updatedValue);
        setScreenShot(stateData.updatedValue.data.screenShots);
      }
    }
  }, [stateData]);
  useEffect(() => {
    if (followData) {
      if (followData.following) {
        setFollowing(followData.following.message);
        if (followData.starFollowers) {
          setFollowers(followData.starFollowers.message);
        }
      }
    }
  }, [followData]);

  const moveToNext = () => {
    if (screenShot.length - 1 === screenShotCounter) {
      setScreenShotCounter(0);
    } else {
      setScreenShotCounter(screenShotCounter + 1);
    }
  };
  let indexOfFirstUser = Offset;
  let indexOfLastUser = Offset + perPage;
  let current = journalDataTemp.slice(indexOfFirstUser, indexOfLastUser);

  const handleJournalChange = pageNumberpaginate => {
    const selectedPage = pageNumberpaginate - 1;
    const offset = selectedPage * perPage;
    setactivePage(selectedPage);
    setOffset(offset);
  };

  let indexOfFirst = OffsetReview;
  let indexOfLast = OffsetReview + perPageReview;
  let currentreview = reviewData.slice(indexOfFirst, indexOfLast);

  const handleReviewChange = pageNumberpaginate => {
    const selectedPage = pageNumberpaginate - 1;
    const OffsetReview = selectedPage * perPageReview;
    setactiveReviewPage(selectedPage);
    setOffsetReview(OffsetReview);
  };
  const StoryPrivate = (temp, storyId) => {
    var data;
    if (temp == 0) {
      data = {
        userId: localStorage.getItem("id"),
        screenShotId: storyId,
        type: "hide",
      };
    } else {
      data = {
        userId: localStorage.getItem("id"),
        screenShotId: storyId,
        type: "unhide",
      };
    }
    dispatch(hideTheStory(data));
  };

  const reviewPrivate = async (type, reviewId, isHide, index) => {
    console.log(type, reviewId, isHide);
    var data = {
      reviewId: reviewId,
      userType: type,
      hide: !isHide,
    };
    await dispatch(hideReview(data));
    let reviewDataTemp = reviewData;
    if (type == "Fan") {
      reviewDataTemp[index].hideByFan = !isHide;
    } else {
      reviewDataTemp[index].hideByArtist = !isHide;
    }
    setReviewData(reviewDataTemp);
  };

  const goToORB = () => {
    console.log("fn called");
    if (
      userInfo.data.type === "chef" ||
      userInfo.data.type === "Chef" ||
      userInfo.data.type === "stylist" ||
      userInfo.data.type === "Stylist"
    ) {
      history.push("/fanChefORB", {
        name: userInfo
          ? userInfo.data.firstName
            ? userInfo.data.firstName
            : "chef"
          : "",
        id: userInfo ? userInfo.data._id : "",
      });
    }
    if (
      userInfo.data.type === "star" ||
      userInfo.data.type === "Star" ||
      userInfo.data.type === "trainer" ||
      userInfo.data.type === "Trainer"
    ) {
      history.push("/fanORB", {
        name: userInfo
          ? userInfo.data.firstName
            ? userInfo.data.firstName
            : "chef"
          : "",
        id: userInfo ? userInfo.data._id : "",
      });
    }
    // else if (
    //   userInfo.data.type === "stylist" ||
    //   userInfo.data.type === "Stylist"
    // ) {
    //   console.log("in else if ");
    //   history.push("/fanStylistORB", {
    //     name: userInfo
    //       ? userInfo.data.firstName
    //         ? userInfo.data.firstName
    //         : "stylist"
    //       : "",
    //     id: userInfo ? userInfo.data._id : "",
    //   });
    // }
  };

  return (
    <div>
      <div className="container p-2 main mt-5">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "20px",
            color: "#6c6b6b",
          }}>
          <p onClick={() => history.push("/")} style={{ cursor: "pointer" }}>
            &#60; back
          </p>
          <p>Story</p>
        </div>
        <div className="chef_image_container position-relative">
          <div className="backgroud_image">
            <img src="../assets/images/chef_journal_background.png" />
          </div>
          <div className="chef_container d-flex">
            <div className="position-relative chef_image_sec">
              <img
                className="w-100"
                src={userInfo ? userInfo.data.profileImgURl : ""}
              />
              <div className="top_chef_details position-absolute d-flex">
                <div className="grey_logo">
                  <img className="w-100" src="../assets/images/grey_logo.png" />
                </div>
                <div className="chef_desc">
                  <div className="chef_name">
                    {userInfo ? userInfo.data.firstName : ""}
                  </div>
                  <div className="chef_designation">
                    {userInfo ? userInfo.data.type : ""}
                  </div>
                  <div className="ref">My shout-out: Ric Brad</div>
                </div>
              </div>
              <div className="live_text_div">
                <h1 className="live_text_h1">LIVE</h1>
              </div>
              <div className="golive_logo">
                <img
                  src="../assets/images/Background.png"
                  onClick={() => {
                    goToORB();
                  }}
                  style={{ border: "solid 2px greem" }}></img>
              </div>
              {/* <div className="join_logo">
                                <img src="../assets/images/button_bg_small.png"></img>
                                <p>JOIN</p>
                            </div> */}
              <div className="down_chef_links position-absolute">
                <div
                  className="mystory_option"
                  onClick={() => setRightPart(1)}
                  style={{ fontWeight: rightPart === 1 ? "600" : "" }}>
                  Pages and Places
                </div>
                <div
                  className="mystory_option"
                  onClick={() => setRightPart(2)}
                  style={{ fontWeight: rightPart === 2 ? "600" : "" }}>
                  Reviews and Comments
                </div>
                <div
                  className="mystory_option"
                  onClick={() => setRightPart(3)}
                  style={{ fontWeight: rightPart === 3 ? "600" : "" }}>
                  Journals
                </div>
              </div>
              <div className="bottom_action position-absolute d-flex">
                <div className="heart_image">
                  <img src="../assets/images/heart.png" />
                </div>
                {userInfo ? (
                  userInfo.data.type !== "Fan" ? (
                    <div className="followers">FOLLOWERS: {followers}</div>
                  ) : (
                    <div className="followers">FOLLOWING: {following}</div>
                  )
                ) : (
                  ""
                )}
              </div>
            </div>
            {rightPart === 1 ? (
              <>
                <div
                  className="journal_sec position-relative"
                  style={{ alignItems: "center" }}>
                  {screenShot ? (
                    screenShot.length > 0 ? (
                      <div>
                        <div className="storyHeader">
                          <div className="storysub1">
                            <p>{screenShot[screenShotCounter].starName}</p>
                            <p>{screenShot[screenShotCounter].date}</p>
                          </div>
                          <div>
                            <p>PAGES AND PLACES</p>
                            {isMyStory ? (
                              <div className="storysub2">
                                {
                                  <input
                                    type="checkbox"
                                    checked={
                                      screenShot[screenShotCounter].private ==
                                      "0"
                                        ? false
                                        : true
                                    }
                                    onChange={() => {
                                      StoryPrivate(
                                        screenShot[screenShotCounter].private,
                                        screenShot[screenShotCounter]._id
                                      );
                                    }}
                                  />
                                }
                                <p>Hide this Page</p>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <img
                          className="w-100"
                          src={screenShot[screenShotCounter].name}
                        />
                        <img
                          className="w-100 nextButton"
                          src="../assets/images/right_calendar_arrow.png"
                          onClick={() => moveToNext()}
                        />
                      </div>
                    ) : (
                      <div>
                        <p>No story found</p>
                      </div>
                    )
                  ) : (
                    ""
                  )}
                </div>
              </>
            ) : rightPart === 2 ? (
              <>
                <div className="journal_sec position-relative">
                  <div class="reviewContainer">
                    <p className="titleReview">Reviews and Comments</p>
                    {reviewData.length === 0 ? (
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}>
                        No review Found
                      </p>
                    ) : (
                      <table className="tableJournal">
                        {console.log("revieewew name", reviewDataName)}
                        {currentreview.map((element, index) => {
                          return (
                            <tr className="fanReviewTable">
                              {userInfo ? (
                                userInfo.data.type === "Fan" ? (
                                  <>
                                    <td>
                                      <img
                                        src={element.artistId.profileImgURl}
                                        className="fanReviewTable_image"></img>
                                    </td>
                                    <td>
                                      <p className="fanReviewTable_time">
                                        {element.date}
                                      </p>
                                      <div className="fanReviewTable_time_name">
                                        <p>{element.artistId.firstName}</p>
                                        <p
                                          style={{
                                            textTransform: "uppercase",
                                            fontWeight: "600",
                                          }}>
                                          {element.artistId.type}
                                        </p>
                                      </div>
                                      <p className="fanReviewTable_comment">
                                        {element.review}
                                      </p>
                                      {isMyStory ? (
                                        <div className="fanReviewTable_hide">
                                          <input
                                            type="checkbox"
                                            checked={element.hideByFan}
                                            onChange={() => {
                                              reviewPrivate(
                                                "Fan",
                                                element._id,
                                                element.hideByFan,
                                                index
                                              );
                                            }}></input>
                                          <label>Hide this page</label>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td>
                                      <img
                                        src={element.fanId.profileImgURl}
                                        className="fanReviewTable_image"></img>
                                    </td>
                                    <td>
                                      <p className="fanReviewTable_time">
                                        {element.date}
                                      </p>
                                      <div className="fanReviewTable_time_name">
                                        <p>{element.fanId.firstName}</p>
                                        <p
                                          style={{
                                            textTransform: "uppercase",
                                            fontWeight: "600",
                                          }}>
                                          {element.fanId.type}
                                        </p>
                                      </div>
                                      <p className="fanReviewTable_comment">
                                        {element.review}
                                      </p>
                                      {isMyStory ? (
                                        <div className="fanReviewTable_hide">
                                          <input
                                            type="checkbox"
                                            checked={element.hideByArtist}
                                            onChange={() => {
                                              reviewPrivate(
                                                "Artist",
                                                element._id,
                                                element.hideByArtist,
                                                index
                                              );
                                            }}></input>
                                          <label>Hide this page</label>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </td>
                                  </>
                                )
                              ) : (
                                ""
                              )}
                              <td
                                style={{
                                  textTransform: "uppercase",
                                  fontWeight: "600",
                                }}>
                                {element.item}
                              </td>
                              <td>
                                <StarRatings
                                  rating={element.rating}
                                  starRatedColor="white"
                                  starEmptyColor="#b1b0b0"
                                  starDimension="25px"
                                  starSpacing="1px"
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </table>
                    )}
                  </div>
                  <Pagination
                    innerClass={"paginate_mystory"}
                    activePage={activeReviewPage + 1}
                    itemsCountPerPage={perPageReview}
                    totalItemsCount={reviewData.length}
                    pageRangeDisplayed={5}
                    onChange={handleReviewChange}
                    className="paggination_mystory"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="journal_sec position-relative">
                  <div className="mainDivJournal">
                    <p className="headerJournal">JOURNAL</p>
                    <table className="tableJournal">
                      {userInfo ? (
                        userInfo.data.type == "Star" ||
                        userInfo.data.type == "Trainer" ? (
                          <>
                            <tr>
                              <th></th>
                              <th>DURATION</th>
                              <th>
                                TICKET <br></br> SOLD
                              </th>
                              <th>
                                TICKET <br></br> PRICE
                              </th>
                              <th>TIPS</th>
                              <th>
                                TOTAL <br></br> EARNINGS
                              </th>
                            </tr>
                            {current.map(element => {
                              return (
                                <tr>
                                  <td>{element.time}</td>
                                  <td>{element.duration}</td>
                                  <td>{element.ticketSold}</td>
                                  <td>{element.ticketPrice}</td>
                                  <td>${element.tips}</td>
                                  <td>${element.total}</td>
                                </tr>
                              );
                            })}
                          </>
                        ) : userInfo.data.type == "Chef" ||
                          userInfo.data.type == "Stylist" ? (
                          <>
                            <tr>
                              <th></th>
                              <th>ITEMS</th>
                              <th>ORDER TOTAL</th>
                              <th>TIPS</th>
                              <th>TOTAL EARNINGS</th>
                            </tr>
                            {current.map(element => {
                              return (
                                <tr>
                                  <td>{element.time}</td>
                                  <td>{element.items}</td>
                                  <td>${element.orderTotal}</td>
                                  <td>${element.tips}</td>
                                  <td>${element.total}</td>
                                </tr>
                              );
                            })}
                          </>
                        ) : (
                          <>
                            {current.map(element => {
                              return (
                                <tr className="fanJurnalTable">
                                  <td>
                                    <img
                                      src={"../assets/images/star.jpg"}></img>
                                  </td>
                                  <td>
                                    <p>{element.time}</p>
                                    <div className="fanJurnalMain">
                                      <p>stylist</p>
                                      <p
                                        style={{
                                          textTransform: "uppercase",
                                          fontWeight: "600",
                                        }}>
                                        FAN
                                      </p>
                                    </div>
                                  </td>
                                  <td
                                    style={{
                                      textTransform: "uppercase",
                                      fontWeight: "600",
                                    }}>
                                    Title
                                  </td>
                                  <td>
                                    <p>payment methods</p>account Number<p></p>
                                  </td>
                                </tr>
                              );
                            })}
                          </>
                        )
                      ) : (
                        <></>
                      )}
                      <Pagination
                        innerClass={"paginate_mystory"}
                        activePage={activePage + 1}
                        itemsCountPerPage={perPage}
                        totalItemsCount={journalDataTemp.length}
                        pageRangeDisplayed={5}
                        onChange={handleJournalChange}
                      />
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyStory;
