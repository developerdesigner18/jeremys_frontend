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
  checkUserInCommunity,
  addToCommunity,
} from "../../actions/userActions";
import { getFollowing, getFollowers } from "../../actions/followActions";
import { checkUserOnline } from "../../actions/orbActions";
import {
  fanJournalData,
  chefJournalData,
  starJournalData,
} from "../../actions/paymentActions";
import Pagination from "react-js-pagination";
import StarRatings from "react-star-ratings";
import { socket } from "../../socketIO";
import {
  getJoinedFanList,
  getUserStatus,
  onlineUserCheck,
} from "../../actions/orbActions";
import swal from "sweetalert";
import moment from "moment";

function MyStory(props) {
  var isMyStory = props.location.state.isMystory;
  const history = useHistory();
  const dispatch = useDispatch();

  const stateData = useSelector((state) => state.user);
  const followData = useSelector((state) => state.follow);
  const stateORB = useSelector((state) => state.ORB);
  const paymentState = useSelector((state) => state.payment);

  const [userInfo, setUserInfo] = useState();
  const [following, setFollowing] = useState();
  const [followers, setFollowers] = useState();
  const [rate, setRate] = useState();
  const [screenShot, setScreenShot] = useState();
  const [screenShotCounter, setScreenShotCounter] = useState(0);
  const [rightPart, setRightPart] = useState(props.location.state.pageNumber);
  const [journalDataTemp, setJournalData] = useState([]);
  const [perPage, setperPage] = React.useState(4);
  const [perPageReview, setperPageReview] = React.useState(4);
  const [activePage, setactivePage] = useState(0);
  const [Offset, setOffset] = useState(0);

  const [reviewData, setReviewData] = useState([]);
  const [reviewDataName, setReviewDataName] = useState("");

  const [activeReviewPage, setactiveReviewPage] = useState(0);
  const [OffsetReview, setOffsetReview] = useState(0);

  const [inCommunity, setInCommunity] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  const [connectedFan, setConnectedFan] = useState([]);

  const [fanJoined, setFanJoined] = useState(false);
  // console.log("props-==--=", props.location);
  useEffect(async () => {
    dispatch(getUserWithId(props.location.state.userId));
    dispatch(getFollowing(props.location.state.userId));
    dispatch(getFollowers(props.location.state.userId));
    dispatch(getReviewOfFan(props.location.state.userId));
    dispatch(getReviewOfArtist(props.location.state.userId));
    dispatch(checkUserOnline(props.location.state.userId));
    dispatch(checkUserInCommunity(props.location.state.userId));
    dispatch(getUserStatus(props.location.state.userId));
    dispatch(getJoinedFanList(props.location.state.userId));
    dispatch(onlineUserCheck(props.location.state.userId));
    if (
      localStorage.getItem("type") == "fan" ||
      localStorage.getItem("type") == "Fan"
    ) {
      dispatch(
        fanJournalData(
          props.location.state.userId,
          localStorage.getItem("type")
        )
      );
    } else if (
      localStorage.getItem("type") == "chef" ||
      localStorage.getItem("type") == "Chef" ||
      localStorage.getItem("type") == "stylist" ||
      localStorage.getItem("type") == "Stylist"
    ) {
      dispatch(chefJournalData(props.location.state.userId));
    } else {
      dispatch(starJournalData(props.location.state.userId));
    }
  }, []);

  useEffect(() => {
    if (stateData) {
      console.log("state data", stateData);
      if (stateData.userInfo) {
        setUserInfo(stateData.userInfo);
        var publicStory = stateData.userInfo.data.screenShots.filter(
          (element) => element.private == "0"
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
                (element) => element.hideByFan === false
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
                (element) => element.hideByArtist === false
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
      if (stateData.checkInCommunityUser) {
        setInCommunity(stateData.checkInCommunityUser);
      }
    }
  }, [stateData]);

  useEffect(() => {
    if (followData) {
      console.log("followdata........... ", followData);
      if (followData.following) {
        setFollowing(followData.following.message);
        if (followData.starFollowers) {
          setFollowers(followData.starFollowers.message);
          if (followData.starFollowers.ratingList.length == 0) {
            setRate(0);
          }
          setRate(followData.starFollowers.average);
        }
      }
    }
  }, [followData]);

  useEffect(() => {
    if (stateORB) {
      console.log("orb state from reducer.........", stateORB);
      if (stateORB.onlineUsers && stateORB.onlineUsers.length) {
        setIsOnline(true);
      }
      if (stateORB.userStatus) {
        if (stateORB.userStatus.onlineStatus) {
          setIsOnline(true);
        }
      }
      if (stateORB.getJoinedFanList && stateORB.getJoinedFanList.length) {
        setConnectedFan(stateORB.getJoinedFanList);
      }
      console.log("stateORB.isFanJoin...........", stateORB.checkOnlineUser);
      if (
        stateORB.checkOnlineUser == true ||
        stateORB.checkOnlineUser == false
      ) {
        setFanJoined(stateORB.checkOnlineUser);
      }
    }
  }, [stateORB]);

  useEffect(() => {
    if (paymentState) {
      if (paymentState.journalData) {
        console.log("journal data.... ", paymentState);
        setJournalData(paymentState.journalData);
      }
    }
  }, [paymentState]);

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

  const handleJournalChange = (pageNumberpaginate) => {
    const selectedPage = pageNumberpaginate - 1;
    const offset = selectedPage * perPage;
    setactivePage(selectedPage);
    setOffset(offset);
  };

  let indexOfFirst = OffsetReview;
  let indexOfLast = OffsetReview + perPageReview;
  let currentreview = reviewData.slice(indexOfFirst, indexOfLast);

  const handleReviewChange = (pageNumberpaginate) => {
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

  const goToORB = async () => {
    console.log("fn called");
    if (
      userInfo.data.type === "chef" ||
      userInfo.data.type === "Chef" ||
      userInfo.data.type === "stylist" ||
      userInfo.data.type === "Stylist"
    ) {
      console.log("connectedFan.length ", fanJoined);
      if (fanJoined) {
        swal("Info", "You can’t join live streaming", "info");
      } else {
        history.push("/fanChefORB", {
          name: userInfo
            ? userInfo.data.firstName
              ? userInfo.data.firstName
              : ""
            : "",
          id: userInfo ? userInfo.data._id : "",
        });
      }
    }
    if (
      userInfo.data.type === "star" ||
      userInfo.data.type === "Star" ||
      userInfo.data.type === "trainer" ||
      userInfo.data.type === "Trainer"
    ) {
      if (connectedFan.length <= 15) {
        history.push("/fanORB", {
          name: userInfo
            ? userInfo.data.firstName
              ? userInfo.data.firstName
              : ""
            : "",
          id: userInfo ? userInfo.data._id : "",
          role: "host",
          type: userInfo ? userInfo.data.type : "",
        });
      } else if (connectedFan.length > 15) {
        history.push("/fanORB", {
          name: userInfo
            ? userInfo.data.firstName
              ? userInfo.data.firstName
              : ""
            : "",
          id: userInfo ? userInfo.data._id : "",
          role: "audience",
          type: userInfo ? userInfo.data.type : "",
        });
      }
    }
  };

  const callAddToCommunity = async () => {
    await dispatch(addToCommunity(props.location.state.userId));
  };

  return (
    <div>
      <div className="container p-2 mt-1">
        {/* <div className="container p-2 main mt-5"> */}
        <div className="grey_logo">
          <img src="../assets/images/grey_logo.png" />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "20px",
            color: "#6c6b6b",
          }}
        >
          <p onClick={() => history.push("/")} style={{ cursor: "pointer" }}>
            &#60; back
          </p>

          <p>{rightPart === 1 ? "PAGES AND PLACES" : "REVIEWS AND COMMENTS"}</p>
        </div>
        <div className="chef_image_container position-relative">
          <div className="backgroud_image">
            <img src="../assets/images/chef_journal_background.png" />
          </div>
          <div className="chef_container d-flex">
            <div className="position-relative chef_image_sec">
              <img
                className="w-100"
                src={
                  userInfo
                    ? userInfo.data.profileImgURl
                      ? userInfo.data.profileImgURl
                      : "https://jeremysLive.com:8000/default/profile.jpg"
                    : "https://jeremysLive.com:8000/default/profile.jpg"
                }
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://jeremysLive.com:8000/default/profile.jpg";
                }}
              />
              <div className="top_chef_details position-absolute d-flex">
                <div className="chef_desc">
                  <div className="chef_name">
                    {userInfo
                      ? userInfo.data.firstName + " " + userInfo.data.lastName
                      : ""}
                  </div>
                  {/* <div className="chef_designation" style={{ color: "white" }}>
                    {userInfo ? userInfo.data.type : ""}
                  </div> */}
                  {/* <div className="ref" style={{ color: "white" }}>
                    My shout-out: Ric Brad
                  </div> */}
                </div>
              </div>
              <div className="live_text_div">
                <h1 className="live_text_h1">{isOnline ? "LIVE" : ""}</h1>
              </div>
              {inCommunity ? (
                isOnline ? (
                  <div className="golive_logo">
                    {isMyStory ? (
                      <></>
                    ) : (
                      <img
                        src="../assets/images/Background.png"
                        onClick={() => {
                          goToORB();
                        }}
                        style={{ border: "solid 2px greem" }}
                      ></img>
                    )}
                  </div>
                ) : null
              ) : isOnline ? (
                <div className="golive_logo">
                  {isMyStory ? (
                    <></>
                  ) : (
                    <img
                      src="../assets/images/Background.png"
                      onClick={() => {
                        goToORB();
                      }}
                      style={{ border: "solid 2px greem" }}
                    ></img>
                  )}
                </div>
              ) : (
                <div className="join_logo">
                  {isMyStory ? (
                    <></>
                  ) : (
                    <>
                      <img
                        src="../assets/images/button_bg_small.png"
                        onClick={callAddToCommunity}
                        style={{ cursor: "pointer" }}
                      ></img>
                      <p>JOIN</p>
                    </>
                  )}
                </div>
              )}
              <div className="down_chef_links position-absolute">
                <div
                  className="mystory_option"
                  onClick={() => setRightPart(1)}
                  style={{ fontWeight: rightPart === 1 ? "600" : "" }}
                >
                  Pages and Places
                </div>
                <div
                  className="mystory_option"
                  onClick={() => setRightPart(2)}
                  style={{ fontWeight: rightPart === 2 ? "600" : "" }}
                >
                  Reviews and Comments
                </div>
                {isMyStory ? (
                  <div
                    className="mystory_option"
                    onClick={() => setRightPart(3)}
                    style={{ fontWeight: rightPart === 3 ? "600" : "" }}
                  >
                    Journals
                  </div>
                ) : (
                  <></>
                )}
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
                <div className="ml-2">
                  {userInfo ? (
                    userInfo.data.type == "fan" ||
                    userInfo.data.type == "Fan" ? null : (
                      <StarRatings
                        rating={rate}
                        starRatedColor="white"
                        starEmptyColor="#b1b0b0"
                        starDimension="25px"
                        starSpacing="1px"
                      />
                    )
                  ) : (
                    <StarRatings
                      rating={rate}
                      starRatedColor="white"
                      starEmptyColor="#b1b0b0"
                      starDimension="25px"
                      starSpacing="1px"
                    />
                  )}
                </div>
              </div>
            </div>
            {rightPart === 1 ? (
              <>
                <div
                  className="journal_sec position-relative"
                  style={{ alignItems: "center" }}
                >
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
                        <p>No Pages and Places found</p>
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
                          position: "absolute",
                          left: "0",
                          top: "0",
                          width: "100%",
                          height: "100%",
                          alignItems: "center",
                        }}
                      >
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
                                        className="fanReviewTable_image"
                                      ></img>
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
                                          }}
                                        >
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
                                            }}
                                          ></input>
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
                                        className="fanReviewTable_image"
                                      ></img>
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
                                          }}
                                        >
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
                                            }}
                                          ></input>
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
                                }}
                              >
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
                    <p className="headerJournal">ACCOUNTING LEDGER</p>
                    <table className="tableJournal">
                      {userInfo ? (
                        userInfo.data.type == "Star" ||
                        userInfo.data.type == "star" ||
                        userInfo.data.type == "trainer" ||
                        userInfo.data.type == "Trainer" ? (
                          <>
                            {current.length == 0 ? (
                              <p
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  position: "absolute",
                                  left: "0",
                                  top: "0",
                                  width: "100%",
                                  height: "100%",
                                  alignItems: "center",
                                }}
                              >
                                No Earnings Found
                              </p>
                            ) : (
                              <>
                                {" "}
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
                                {current.map((element) => {
                                  let orderTotal =
                                    element.soldTicket * element.ticketPrice;
                                  let totalEarning = orderTotal + element.tips;
                                  var hours = "00",
                                    minutes = "00";
                                  if (element.duraion) {
                                    hours = Math.floor(element.duraion / 60);

                                    minutes = element.duraion % 60;
                                    if (minutes < 10) {
                                      minutes = "0" + minutes;
                                    }
                                  }
                                  return (
                                    <tr>
                                      <td>
                                        <p className="mb-0">
                                          {moment(element.createdAt).format(
                                            "DD MMM YYYY"
                                          )}
                                        </p>
                                        <p className="mb-0">
                                          {moment(element.createdAt).format(
                                            "HH:mm"
                                          )}
                                        </p>
                                      </td>
                                      <td>{`${hours} : ${minutes} hours`}</td>
                                      <td>{element.soldTicket}</td>
                                      <td>${element.ticketPrice}</td>
                                      <td>${element.tips}</td>
                                      <td>${totalEarning}</td>
                                    </tr>
                                  );
                                })}
                              </>
                            )}
                          </>
                        ) : userInfo.data.type == "Chef" ||
                          userInfo.data.type == "chef" ||
                          userInfo.data.type == "stylist" ||
                          userInfo.data.type == "Stylist" ? (
                          <>
                            {current.length == 0 ? (
                              <p
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  position: "absolute",
                                  left: "0",
                                  top: "0",
                                  width: "100%",
                                  height: "100%",
                                  alignItems: "center",
                                }}
                              >
                                No Earnings Found
                              </p>
                            ) : (
                              <>
                                {/* {console.log("current-=-=-=", current)}{" "} */}
                                <tr>
                                  <th></th>
                                  <th>ITEMS</th>
                                  <th>ORDER TOTAL</th>
                                  <th>TIPS</th>
                                  <th>TOTAL EARNINGS</th>
                                </tr>
                                {current.map((element) => {
                                  let orderTotal = 0;

                                  console.log("element-=-=-=", element);

                                  if (
                                    element.price &&
                                    element.price.length > 0
                                  ) {
                                    orderTotal = element.price.reduce(
                                      (a, b) => parseFloat(a) + parseFloat(b),
                                      0
                                    );
                                  }
                                  return (
                                    <tr>
                                      <td>
                                        <p className="mb-0">
                                          {moment(element.createdAt).format(
                                            "DD MMM YYYY"
                                          )}
                                        </p>
                                        <p className="mb-0">
                                          {moment(element.createdAt).format(
                                            "HH:mm"
                                          )}
                                        </p>
                                      </td>
                                      <td>
                                        {element.item
                                          ? element.item.map((item) => (
                                              <p className="mb-0">{item}</p>
                                            ))
                                          : "item"}
                                      </td>
                                      <td>${orderTotal}</td>
                                      <td>${element.tip}</td>
                                      <td>
                                        $
                                        {parseFloat(orderTotal) +
                                          parseFloat(element.tip)}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            {current.map((element) => {
                              return (
                                <tr className="fanJurnalTable">
                                  <td>
                                    <img
                                      src={element.userId.profileImgURl}
                                    ></img>
                                  </td>
                                  <td>
                                    <p className="mb-0">
                                      {moment(element.createdAt).format(
                                        "DD MMM YYYY"
                                      ) +
                                        " " +
                                        moment(element.createdAt).format(
                                          "HH:mm"
                                        )}
                                    </p>
                                    <div className="fanJurnalMain">
                                      <p>
                                        {element.userId.firstName +
                                          " " +
                                          element.userId.lastName}
                                      </p>
                                      <p
                                        style={{
                                          textTransform: "uppercase",
                                          fontWeight: "600",
                                        }}
                                      >
                                        {element.userId.type}
                                      </p>
                                    </div>
                                  </td>
                                  <td
                                    style={{
                                      textTransform: "uppercase",
                                      fontWeight: "600",
                                    }}
                                  >
                                    {element.item.join()}

                                    <p>${element.total}</p>
                                  </td>
                                  <td>
                                    <p>payment methods: Paypal</p>
                                    {/* <p>account Number</p> */}
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
