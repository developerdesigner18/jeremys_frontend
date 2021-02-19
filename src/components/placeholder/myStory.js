import React, { useEffect, useRef, useState } from "react"
import { useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import "../../assets/css/myStory.css"
import { getUserWithId } from "../../actions/userActions";
import { getFollowing, getFollowers } from "../../actions/followActions";

function MyStory() {
    const history = useHistory()
    const dispatch = useDispatch();

    const stateData = useSelector(state => state.user);
    const followData = useSelector(state => state.follow);

    const [userInfo, setUserInfo] = useState();
    const [following, setFollowing] = useState();
    const [followers, setFollowers] = useState();
    const [screenShot, setScreenShot] = useState();
    const [screenShotCounter, setScreenShotCounter] = useState(0);

    useEffect(() => {
        dispatch(getUserWithId(localStorage.getItem("id")));
        dispatch(getFollowing(localStorage.getItem("id")));
        dispatch(getFollowers(localStorage.getItem("id")));
    }, []);
    useEffect(() => {
        if (stateData) {
            if (stateData.userInfo) {
                setUserInfo(stateData.userInfo);
                setScreenShot(stateData.userInfo.data.screenShots)
            }
        }
    }, [stateData]);
    useEffect(() => {
        if (followData) {
            if (followData.following) {
                if (followData.following.followerId == localStorage.getItem("id")) {
                    setFollowing(followData.following.message);
                }
                if (followData.starFollowers) {
                    setFollowers(followData.starFollowers.message);

                }
            }
        }
    }, [followData]);

    const moveToNext = () => {
        if ((screenShot.length - 1) === screenShotCounter) {
            setScreenShotCounter(0)
        } else {
            setScreenShotCounter(screenShotCounter + 1)
        }
    }

    return (
        <div>
            {console.log("user data",following,userInfo)}
            <div className="container p-2 main mt-5">
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", color: "#6c6b6b" }}>
                    <p onClick={() => history.push("/")} style={{ cursor: "pointer" }}>&#60; back</p>
                    <p>My story</p>
                </div>
                <div className="chef_image_container position-relative">
                    <div className="backgroud_image">
                        <img src="../assets/images/chef_journal_background.png" />
                    </div>
                    <div className="chef_container d-flex">
                        <div className="position-relative chef_image_sec">
                            <img className="w-100" src={userInfo ? userInfo.data.profileImgURl : ""} />
                            <div className="top_chef_details position-absolute d-flex">
                                <div className="grey_logo">
                                    <img className="w-100" src="../assets/images/grey_logo.png" />
                                </div>
                                <div className="chef_desc">
                                    <div className="chef_name">{userInfo ? userInfo.data.firstName : ""}</div>
                                    <div className="chef_designation">{userInfo ? userInfo.data.type : ""}</div>
                                    <div className="ref">My shout-out: Ric Brad</div>
                                </div>
                            </div>
                            <div className="down_chef_links position-absolute">
                                <a href="#"><div >Pages and Places</div></a>
                                <a href="#"><div >Reviews and Comments</div></a>
                            </div>
                            <div className="bottom_action position-absolute d-flex">
                                <div className="heart_image">
                                    <img src="../assets/images/heart.png" />
                                </div>
                                {userInfo ? userInfo.data.type !== "Fan" ? <div className="followers">FOLLOWINGS: {followers}</div> : <div className="followers">FOLLOWERS: {following}</div> : ""
                                }
                            </div>
                        </div>
                        <div className="journal_sec position-relative">
                            {
                                screenShot ? screenShot.length > 0 ?
                                    <div>
                                        <img className="w-100" src={screenShot[screenShotCounter].name} />
                                        <img className="w-100 nextButton" src="../assets/images/right_calendar_arrow.png" onClick={() => moveToNext()} />
                                    </div>
                                    : <div>
                                        <p>No story found</p>
                                    </div> : ""
                            }
                            <div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyStory;