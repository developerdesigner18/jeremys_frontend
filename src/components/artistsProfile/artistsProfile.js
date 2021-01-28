import React, { useState } from "react";
import "../../assets/css/artistsProfile.css";
import Header from "../header/Header";
import { useSelector, useDispatch } from "react-redux";
import { addInterest } from "../../actions/userActions";
function ArtistsProfile(props) {
  const dispatch = useDispatch();
  const [artistType, setArtistType] = useState(localStorage.getItem("type"));
  //   setArtistType(localStorage.getItem("type"));
  const [chefTypes, setchefTypes] = useState([
    { label: "ITALIAN", checked: false },
    { label: "JAPANESE", checked: false },
    { label: "KOREAN", checked: false },
    { label: "THAI", checked: false },
    { label: "MEXICAN", checked: false },
    { label: "INDIAN", checked: false },
    { label: "VIETNAM", checked: false },
    { label: "MEDITERRANEAN", checked: false },
    { label: "EUROPEAN", checked: false },
    { label: "ARABIAN", checked: false },
    { label: "PINOY", checked: false },
    { label: "CHINESE", checked: false },
    { label: "AMERICAN BBQ", checked: false },
  ]);
  const [stylistTypes, setstylistTypes] = useState([
    { checked: false, label: "CLOTHING" },
    { checked: false, label: "COLLECTIBLES" },
    { checked: false, label: "VINTAGE" },
    { checked: false, label: "BRIDAL" },
    { checked: false, label: "MAKE-UP ACCESSORIES" },
  ]);
  const [starPerformerTypes, setstarPerformerTypes] = useState([
    { checked: false, label: "SOLO SINGER" },
    { checked: false, label: "DUO BAND" },
    { checked: false, label: "TRIO BAND" },
    { checked: false, label: "GROUP BAND" },
    { checked: false, label: "KPOP BAND" },
    { checked: false, label: "JPOP BAND" },
  ]);
  const [starGenreTypes, setstarGenreTypes] = useState([
    { checked: false, label: "POP" },
    { checked: false, label: "RNB" },
    { checked: false, label: "JAZZ" },
    { checked: false, label: "BALLAD" },
    { checked: false, label: "DISCO" },
    { checked: false, label: "BOSSA NOVA" },
    { checked: false, label: "CLASSICAL" },
    { checked: false, label: "ROCK" },
    { checked: false, label: "ORCHESTRA" },
    { checked: false, label: "BLUES" },
    { checked: false, label: "COUNTRY" },
    { checked: false, label: "LATIN" },
    { checked: false, label: "ROCK & ROLL" },
    { checked: false, label: "HEAVY METAL" },
    { checked: false, label: "SLOW ROCK" },
    { checked: false, label: "FUSION" },
  ]);
  const [trainerTypes, settrainerTypes] = useState([
    { checked: false, label: "YOGA" },
    { checked: false, label: "ZUMBA" },
    { checked: false, label: "BODY BUILDING" },
    { checked: false, label: "BALLET" },
    { checked: false, label: "MARTIAL ARTS" },
  ]);
  const [foodChoices, setfoodChoices] = useState([]);
  const [musicChoices, setmusicChoices] = useState([]);
  const [styleChoices, setstyleChoices] = useState([]);
  const [fitnessChoices, setfitnessChoices] = useState([]);
  const [addMorefoodChoices, setaddMorefoodChoices] = useState(false);
  const [addMorestyleChoices, setaddMorestyleChoices] = useState(false);
  const [addMoremusicChoices, setaddMoremusicChoices] = useState(false);
  const [addMorefitnessChoices, setaddMorefitnessChoices] = useState(false);
  const [newfitnessChoice, setnewfitnessChoice] = useState("");
  const [newfoodChoice, setnewfoodChoice] = useState("");
  const [newmusicChoice, setnewmusicChoice] = useState("");
  const [newstyleChoice, setnewstyleChoice] = useState("");
  const [newfitnessError, setnewfitnessError] = useState("");
  const [newfoodError, setnewfoodError] = useState("");
  const [newmusicError, setnewmusicError] = useState("");
  const [newstyleError, setnewstyleError] = useState("");
  const addMore = (type) => {
    if (type == "food") {
      setaddMorefoodChoices(true);
    }
    if (type == "style") {
      setaddMorestyleChoices(true);
    }
    if (type == "music") {
      setaddMoremusicChoices(true);
    }
    if (type == "fitness") {
      setaddMorefitnessChoices(true);
    }
  };
  const addnewChoice = (type) => {
    if (type == "food") {
      const found = chefTypes.find(
        (element) => element.label == newfoodChoice.toUpperCase()
      );
      if (found) {
        setnewfoodError(
          `${
            newfoodChoice.charAt(0).toUpperCase() + newfoodChoice.slice(1)
          } already available in the list`
        );
        setTimeout(() => setnewfoodError(""), 5000);
      } else {
        setchefTypes([
          ...chefTypes,
          { label: newfoodChoice.toUpperCase(), checked: true },
        ]);
        setfoodChoices([...foodChoices, newfoodChoice.toUpperCase()]);
        setaddMorefoodChoices(false);
        setnewfoodError("");
      }
    }
    if (type == "music") {
      const found = starGenreTypes.find(
        (element) => element.label == newmusicChoice.toUpperCase()
      );
      if (found) {
        setnewmusicError(
          `${
            newmusicChoice.charAt(0).toUpperCase() + newmusicChoice.slice(1)
          } already available in the list`
        );
        setTimeout(() => setnewmusicError(""), 5000);
      } else {
        setstarGenreTypes([
          ...starGenreTypes,
          { label: newmusicChoice.toUpperCase(), checked: true },
        ]);
        setfitnessChoices([...musicChoices, newmusicChoice.toUpperCase()]);
        setaddMoremusicChoices(false);
        setnewmusicError("");
      }
    }
    if (type == "style") {
      const found = stylistTypes.find(
        (element) => element.label == newstyleChoice.toUpperCase()
      );
      if (found) {
        setnewstyleError(
          `${
            newstyleChoice.charAt(0).toUpperCase() + newstyleChoice.slice(1)
          } already available in the list`
        );
        setTimeout(() => setnewstyleError(""), 5000);
      } else {
        setstylistTypes([
          ...stylistTypes,
          { label: newstyleChoice.toUpperCase(), checked: true },
        ]);
        setstyleChoices([...musicChoices, newstyleChoice.toUpperCase()]);
        setaddMorestyleChoices(false);
        setnewstyleError("");
      }
    }
    if (type == "fitness") {
      const found = trainerTypes.find(
        (element) => element.label == newfitnessChoice.toUpperCase()
      );
      if (found) {
        setnewfitnessError(
          `${
            newfitnessChoice.charAt(0).toUpperCase() + newfitnessChoice.slice(1)
          } already available in the list`
        );
        setTimeout(() => setnewfitnessError(""), 5000);
      } else {
        settrainerTypes([
          ...trainerTypes,
          { label: newfitnessChoice.toUpperCase(), checked: true },
        ]);
        setstyleChoices([...musicChoices, newfitnessChoice.toUpperCase()]);
        setaddMorefitnessChoices(false);
        setnewfitnessError("");
      }
    }
  };
  const createProfile = () => {
    dispatch(
      addInterest(
        foodChoices,
        styleChoices,
        musicChoices,
        fitnessChoices,
        props
      )
    );
  };
  return (
    <div className="container">
      <Header />
      <div class="container mt-5">
        {" "}
        {artistType == "chef" || artistType == "Chef" ? (
          <>
            <div class="chef_title text-center">CHEF’S BACKDROP</div>
            <div class="cuisine_container mt-5">
              <form>
                <div class="cuisine_title">*CUISINE</div>
                <div class="dishes_content d-flex mt-4">
                  <div className="dishes_container">
                    {chefTypes.map((type, i) =>
                      i < chefTypes.length / 2 ? (
                        <div>
                          <input
                            type="checkbox"
                            id={type.label}
                            checked={type.checked}
                            onChange={() => {
                              const newArr = [...chefTypes];
                              newArr[i].checked = !newArr[i].checked;
                              setchefTypes(newArr);
                              let food = [...foodChoices];
                              if (newArr[i].checked) {
                                food.push(type.label);
                              } else {
                                let index = food.indexOf(type.label);

                                if (index > -1) {
                                  food.splice(index, 1);
                                }
                              }
                              setfoodChoices(food);
                            }}
                          />
                          <label className="" for={type.label}>
                            {type.label}
                          </label>
                        </div>
                      ) : null
                    )}
                  </div>
                  <div className="dishes_container">
                    {chefTypes.map((type, i) =>
                      i >= chefTypes.length / 2 ? (
                        <div>
                          <input
                            type="checkbox"
                            id={type.label}
                            checked={type.checked}
                            onChange={() => {
                              const newArr = [...chefTypes];
                              newArr[i].checked = !newArr[i].checked;
                              setchefTypes(newArr);
                              let food = [...foodChoices];
                              if (newArr[i].checked) {
                                food.push(type.label);
                              } else {
                                let index = food.indexOf(type.label);

                                if (index > -1) {
                                  food.splice(index, 1);
                                }
                              }
                              setfoodChoices(food);
                            }}
                          />
                          <label className="" for={type.label}>
                            {type.label}
                          </label>
                        </div>
                      ) : null
                    )}
                    {addMorefoodChoices ? (
                      <>
                        <div className="">
                          <input
                            type="text"
                            placeholder="Add cuisine"
                            onChange={(e) => setnewfoodChoice(e.target.value)}
                          />
                        </div>
                        {newfoodError != "" ? (
                          <div
                            style={{
                              color: "red",
                            }}
                          >
                            {newfoodError}
                          </div>
                        ) : null}

                        <div className="mt-1">
                          <button
                            className="create_profile "
                            onClick={(e) => {
                              e.preventDefault();
                              addnewChoice("food");
                            }}
                          >
                            ADD
                          </button>{" "}
                          <button
                            className="create_profile "
                            onClick={(e) => {
                              setaddMorefoodChoices(false);
                              setnewfoodError("");
                            }}
                          >
                            CANCEL
                          </button>
                        </div>
                      </>
                    ) : (
                      <a
                        style={{ cursor: "pointer" }}
                        onClick={() => addMore("food")}
                      >
                        + Add more
                      </a>
                    )}{" "}
                  </div>
                </div>
              </form>
            </div>
          </>
        ) : artistType == "Stylist" || artistType == "Stylist" ? (
          <>
            <div class="chef_title text-center ">STYLIST BACKDROP</div>
            <div class="cuisine_container mt-5 ">
              <form>
                <div class="cuisine_title ">*SELLING</div>
                <div class="dishes_content d-flex mt-4">
                  <div className="dishes_container">
                    {stylistTypes.map((type, i) =>
                      i < stylistTypes.length / 2 ? (
                        <div>
                          <input
                            type="checkbox"
                            id={type.label}
                            checked={type.checked}
                            onChange={() => {
                              const newArr = [...stylistTypes];
                              newArr[i].checked = !newArr[i].checked;
                              setstylistTypes(newArr);
                              let food = [...styleChoices];
                              if (newArr[i].checked) {
                                food.push(type.label);
                              } else {
                                let index = food.indexOf(type.label);
                                if (index > -1) {
                                  food.splice(index, 1);
                                }
                              }
                              setstyleChoices(food);
                            }}
                          />
                          <label className="" for={type.label}>
                            {type.label}
                          </label>
                        </div>
                      ) : null
                    )}
                  </div>
                  <div className="dishes_container">
                    {stylistTypes.map((type, i) =>
                      i >= stylistTypes.length / 2 ? (
                        <div>
                          <input
                            type="checkbox"
                            id={type.label}
                            checked={type.checked}
                            onChange={() => {
                              const newArr = [...chefTypes];
                              stylistTypes[i].checked = !stylistTypes[i]
                                .checked;
                              setstylistTypes(newArr);
                            }}
                          />
                          <label className="" for={type.label}>
                            {type.label}
                          </label>
                        </div>
                      ) : null
                    )}
                    <div>
                      {addMorestyleChoices ? (
                        <>
                          {" "}
                          <div className="">
                            <input
                              type="text"
                              placeholder="Add your style"
                              onChange={(e) =>
                                setnewstyleChoice(e.target.value)
                              }
                            />
                          </div>{" "}
                          {newstyleError != "" ? (
                            <div
                              style={{
                                color: "red",
                              }}
                            >
                              {newstyleError}
                            </div>
                          ) : null}
                          <div className="mt-1">
                            <button
                              className="create_profile "
                              onClick={(e) => {
                                e.preventDefault();
                                addnewChoice("style");
                              }}
                            >
                              ADD
                            </button>{" "}
                            <button
                              className="create_profile "
                              onClick={(e) => {
                                setaddMorestyleChoices(false);
                                setnewstyleError("");
                              }}
                            >
                              CANCEL
                            </button>
                          </div>
                        </>
                      ) : (
                        <a
                          style={{ cursor: "pointer" }}
                          onClick={() => addMore("style")}
                        >
                          + Add more
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </>
        ) : artistType == "Star" || artistType == "star" ? (
          <>
            <div class="chef_title text-center ">STAR</div>
            <div class="cuisine_container mt-5 ">
              <form>
                <div class="cuisine_title ">*TYPE OF PERFORMER</div>
                <div class="dishes_content d-flex mt-4">
                  <div className="dishes_container">
                    {starPerformerTypes.map((type, i) => (
                      <div>
                        <input
                          type="checkbox"
                          id={type.label}
                          checked={type.checked}
                          onChange={() => {
                            const newArr = [...starPerformerTypes];
                            newArr[i].checked = !newArr[i].checked;
                            setstarPerformerTypes(newArr);
                          }}
                        />
                        <label className="" for={type.label}>
                          {type.label}
                        </label>
                      </div>
                    ))}{" "}
                    <div>
                      <a href="#">+ Add more</a>
                    </div>
                  </div>
                </div>
              </form>

              <form>
                <div class="cuisine_title mt-5">*GENRE</div>
                <div class="dishes_content d-flex mt-4">
                  <div className="dishes_container">
                    {starGenreTypes.map((type, i) =>
                      i < starGenreTypes.length / 2 ? (
                        <div>
                          <input
                            type="checkbox"
                            id={type.label}
                            checked={type.checked}
                            onChange={() => {
                              const newArr = [...starGenreTypes];
                              newArr[i].checked = !newArr[i].checked;
                              setstarGenreTypes(newArr);
                              let food = [...musicChoices];
                              if (newArr[i].checked) {
                                food.push(type.label);
                              } else {
                                let index = food.indexOf(type.label);
                                if (index > -1) {
                                  food.splice(index, 1);
                                }
                              }
                              setmusicChoices(food);
                            }}
                          />
                          <label className="" for={type.label}>
                            {type.label}
                          </label>
                        </div>
                      ) : null
                    )}
                  </div>
                  <div className="dishes_container">
                    {starGenreTypes.map((type, i) =>
                      i >= starGenreTypes.length / 2 ? (
                        <div>
                          <input
                            type="checkbox"
                            id={type.label}
                            checked={type.checked}
                            onChange={() => {
                              const newArr = [...starGenreTypes];
                              newArr[i].checked = !newArr[i].checked;
                              setstarGenreTypes(newArr);
                              let food = [...musicChoices];
                              if (newArr[i].checked) {
                                food.push(type.label);
                              } else {
                                let index = food.indexOf(type.label);
                                if (index > -1) {
                                  food.splice(index, 1);
                                }
                              }
                              setmusicChoices(food);
                            }}
                          />
                          <label className="" for={type.label}>
                            {type.label}
                          </label>
                        </div>
                      ) : null
                    )}
                    {addMoremusicChoices ? (
                      <>
                        <div className="">
                          <input
                            type="text"
                            placeholder="Add music genre"
                            onChange={(e) => setnewmusicChoice(e.target.value)}
                          />
                        </div>{" "}
                        {newmusicError != "" ? (
                          <div
                            style={{
                              color: "red",
                            }}
                          >
                            {newmusicError}
                          </div>
                        ) : null}
                        <div className="mt-1">
                          <button
                            className="create_profile "
                            onClick={(e) => {
                              e.preventDefault();
                              addnewChoice("music");
                            }}
                          >
                            {" "}
                            ADD
                          </button>{" "}
                          <button
                            className="create_profile "
                            onClick={(e) => {
                              setaddMoremusicChoices(false);
                              setnewmusicError("");
                            }}
                          >
                            CANCEL
                          </button>
                        </div>
                      </>
                    ) : (
                      <a
                        style={{ cursor: "pointer" }}
                        onClick={() => addMore("music")}
                      >
                        + Add more
                      </a>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </>
        ) : artistType == "Trainer" || artistType == "Trainer" ? (
          <>
            <div class="chef_title text-center ">TRAINER</div>
            <div class="cuisine_container mt-5 ">
              <form>
                <div class="cuisine_title ">*TYPE OF FITNESS</div>
                <div class="dishes_content d-flex mt-4">
                  <div className="dishes_container ">
                    {trainerTypes.map((type, i) => (
                      <div>
                        <input
                          type="checkbox"
                          id={type.label}
                          checked={type.checked}
                          onChange={() => {
                            const newArr = [...trainerTypes];
                            newArr[i].checked = !newArr[i].checked;
                            settrainerTypes(newArr);
                            let food = [...fitnessChoices];
                            if (newArr[i].checked) {
                              food.push(type.label);
                            } else {
                              let index = food.indexOf(type.label);
                              if (index > -1) {
                                food.splice(index, 1);
                              }
                            }
                            setfitnessChoices(food);
                          }}
                        />
                        <label className="" for={type.label}>
                          {type.label}
                        </label>
                      </div>
                    ))}
                    <div>
                      {addMorefitnessChoices ? (
                        <>
                          <div className="">
                            <input
                              type="text"
                              placeholder="Add fitness type"
                              onChange={(e) =>
                                setnewfitnessChoice(e.target.value)
                              }
                            />{" "}
                          </div>{" "}
                          {newfitnessError != "" ? (
                            <div
                              style={{
                                color: "red",
                              }}
                            >
                              {newfitnessError}
                            </div>
                          ) : null}
                          <div className="mt-1">
                            <button
                              className="create_profile "
                              onClick={(e) => {
                                e.preventDefault();
                                addnewChoice("fitness");
                              }}
                            >
                              ADD
                            </button>{" "}
                            <button
                              className="create_profile "
                              onClick={(e) => {
                                setaddMorefitnessChoices(false);
                                setnewfitnessError("");
                              }}
                            >
                              CANCEL
                            </button>
                          </div>
                        </>
                      ) : (
                        <a
                          style={{ cursor: "pointer" }}
                          onClick={() => addMore("fitness")}
                        >
                          + Add more
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </>
        ) : artistType == "fan" || artistType == "Fan" ? (
          <>
            <div class="cuisine_container mt-5 ">
              <form>
                <div class="cuisine_title ">*FOOD YOU LOVE</div>
                <div class="dishes_content d-flex mt-4">
                  <div className="dishes_container">
                    {chefTypes.map((type, i) =>
                      i < chefTypes.length / 2 ? (
                        <div>
                          <input
                            type="checkbox"
                            id={type.label}
                            checked={type.checked}
                            onChange={() => {
                              const newArr = [...chefTypes];
                              newArr[i].checked = !newArr[i].checked;
                              setchefTypes(newArr);
                              let food = [...foodChoices];
                              if (newArr[i].checked) {
                                food.push(type.label);
                              } else {
                                let index = food.indexOf(type.label);
                                if (index > -1) {
                                  food.splice(index, 1);
                                }
                              }
                              setfoodChoices(food);
                            }}
                          />
                          <label className="" for={type.label}>
                            {type.label}
                          </label>
                        </div>
                      ) : null
                    )}
                  </div>
                  <div className="dishes_container">
                    {chefTypes.map((type, i) =>
                      i >= chefTypes.length / 2 ? (
                        <div>
                          <input
                            type="checkbox"
                            id={type.label}
                            checked={type.checked}
                            onChange={() => {
                              const newArr = [...chefTypes];
                              newArr[i].checked = !newArr[i].checked;
                              setchefTypes(newArr);
                              let food = [...foodChoices];
                              if (newArr[i].checked) {
                                food.push(type.label);
                              } else {
                                let index = food.indexOf(type.label);

                                if (index > -1) {
                                  food.splice(index, 1);
                                }
                              }
                              setfoodChoices(food);
                            }}
                          />
                          <label className="" for={type.label}>
                            {type.label}
                          </label>
                        </div>
                      ) : null
                    )}

                    {addMorefoodChoices ? (
                      <>
                        <div className="">
                          <input
                            type="text"
                            placeholder="Add cuisine"
                            onChange={(e) => setnewfoodChoice(e.target.value)}
                          />
                        </div>
                        {newfoodError != "" ? (
                          <div
                            style={{
                              color: "red",
                            }}
                          >
                            {newfoodError}
                          </div>
                        ) : null}

                        <div className="mt-1">
                          <button
                            className="create_profile "
                            onClick={(e) => {
                              e.preventDefault();
                              addnewChoice("food");
                            }}
                          >
                            ADD
                          </button>{" "}
                          <button
                            className="create_profile "
                            onClick={(e) => {
                              setaddMorefoodChoices(false);
                              setnewfoodError("");
                            }}
                          >
                            CANCEL
                          </button>
                        </div>
                      </>
                    ) : (
                      <a
                        style={{ cursor: "pointer" }}
                        onClick={() => addMore("food")}
                      >
                        + Add more
                      </a>
                    )}
                  </div>
                </div>
              </form>
            </div>
            <div class="cuisine_container mt-5 ">
              <form>
                <div class="cuisine_title ">*MUSIC GENRES YOU WANT TO HEAR</div>
                <div class="dishes_content d-flex mt-4">
                  <div className="dishes_container">
                    {starGenreTypes.map((type, i) =>
                      i < starGenreTypes.length / 2 ? (
                        <div>
                          <input
                            type="checkbox"
                            id={type.label}
                            checked={type.checked}
                            onChange={() => {
                              const newArr = [...starGenreTypes];
                              newArr[i].checked = !newArr[i].checked;
                              setstarGenreTypes(newArr);
                              let food = [...musicChoices];
                              if (newArr[i].checked) {
                                food.push(type.label);
                              } else {
                                let index = food.indexOf(type.label);
                                if (index > -1) {
                                  food.splice(index, 1);
                                }
                              }
                              setmusicChoices(food);
                            }}
                          />
                          <label className="" for={type.label}>
                            {type.label}
                          </label>
                        </div>
                      ) : null
                    )}
                  </div>
                  <div className="dishes_container">
                    {starGenreTypes.map((type, i) =>
                      i >= starGenreTypes.length / 2 ? (
                        <div>
                          <input
                            type="checkbox"
                            id={type.label}
                            checked={type.checked}
                            onChange={() => {
                              const newArr = [...starGenreTypes];
                              newArr[i].checked = !newArr[i].checked;
                              setstarGenreTypes(newArr);
                              let food = [...musicChoices];
                              if (newArr[i].checked) {
                                food.push(type.label);
                              } else {
                                let index = food.indexOf(type.label);
                                if (index > -1) {
                                  food.splice(index, 1);
                                }
                              }
                              setmusicChoices(food);
                            }}
                          />
                          <label className="" for={type.label}>
                            {type.label}
                          </label>
                        </div>
                      ) : null
                    )}
                    <div>
                      {addMoremusicChoices ? (
                        <>
                          <div className="">
                            <input
                              type="text"
                              placeholder="Add music genre"
                              onChange={(e) =>
                                setnewmusicChoice(e.target.value)
                              }
                            />
                          </div>{" "}
                          {newmusicError != "" ? (
                            <div
                              style={{
                                color: "red",
                              }}
                            >
                              {newmusicError}
                            </div>
                          ) : null}
                          <div className="mt-1">
                            <button
                              className="create_profile "
                              onClick={(e) => {
                                e.preventDefault();
                                addnewChoice("music");
                              }}
                            >
                              {" "}
                              ADD
                            </button>{" "}
                            <button
                              className="create_profile "
                              onClick={(e) => {
                                setaddMoremusicChoices(false);
                                setnewmusicError("");
                              }}
                            >
                              CANCEL
                            </button>
                          </div>
                        </>
                      ) : (
                        <a
                          style={{ cursor: "pointer" }}
                          onClick={() => addMore("music")}
                        >
                          + Add more
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div class="cuisine_container mt-5 ">
              <form>
                <div class="cuisine_title ">*JUST YOUR STYLE</div>
                <div class="dishes_content d-flex mt-4">
                  <div className="dishes_container ">
                    {stylistTypes.map((type, i) => (
                      <div>
                        <input
                          type="checkbox"
                          id={type.label}
                          checked={type.checked}
                          onChange={() => {
                            const newArr = [...stylistTypes];
                            newArr[i].checked = !newArr[i].checked;
                            setstylistTypes(newArr);
                            let food = [...styleChoices];
                            if (newArr[i].checked) {
                              food.push(type.label);
                            } else {
                              let index = food.indexOf(type.label);
                              if (index > -1) {
                                food.splice(index, 1);
                              }
                            }
                            setstyleChoices(food);
                          }}
                        />
                        <label className="" for={type.label}>
                          {type.label}
                        </label>
                      </div>
                    ))}
                    <div>
                      {addMorestyleChoices ? (
                        <>
                          {" "}
                          <div className="">
                            <input
                              type="text"
                              placeholder="Add your style"
                              onChange={(e) =>
                                setnewstyleChoice(e.target.value)
                              }
                            />
                          </div>{" "}
                          {newstyleError != "" ? (
                            <div
                              style={{
                                color: "red",
                              }}
                            >
                              {newstyleError}
                            </div>
                          ) : null}
                          <div className="mt-1">
                            <button
                              className="create_profile "
                              onClick={(e) => {
                                e.preventDefault();
                                addnewChoice("style");
                              }}
                            >
                              ADD
                            </button>{" "}
                            <button
                              className="create_profile "
                              onClick={(e) => {
                                setaddMorestyleChoices(false);
                                setnewstyleError("");
                              }}
                            >
                              CANCEL
                            </button>
                          </div>
                        </>
                      ) : (
                        <a
                          style={{ cursor: "pointer" }}
                          onClick={() => addMore("style")}
                        >
                          + Add more
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div class="cuisine_container mt-5 ">
              <form>
                <div class="cuisine_title ">
                  *FITNESS AND WELL BEING FOR YOU
                </div>
                <div class="dishes_content d-flex mt-4">
                  <div className="dishes_container ">
                    {trainerTypes.map((type, i) => (
                      <div>
                        <input
                          type="checkbox"
                          id={type.label}
                          checked={type.checked}
                          onChange={() => {
                            const newArr = [...trainerTypes];
                            newArr[i].checked = !newArr[i].checked;
                            settrainerTypes(newArr);
                            let food = [...fitnessChoices];
                            if (newArr[i].checked) {
                              food.push(type.label);
                            } else {
                              let index = food.indexOf(type.label);
                              if (index > -1) {
                                food.splice(index, 1);
                              }
                            }
                            setfitnessChoices(food);
                          }}
                        />
                        <label className="" for={type.label}>
                          {type.label}
                        </label>
                      </div>
                    ))}
                    <div>
                      {addMorefitnessChoices ? (
                        <>
                          <div className="">
                            <input
                              type="text"
                              placeholder="Add fitness type"
                              onChange={(e) =>
                                setnewfitnessChoice(e.target.value)
                              }
                            />{" "}
                          </div>{" "}
                          {newfitnessError != "" ? (
                            <div
                              style={{
                                color: "red",
                              }}
                            >
                              {newfitnessError}
                            </div>
                          ) : null}
                          <div className="mt-1">
                            <button
                              className="create_profile "
                              onClick={(e) => {
                                e.preventDefault();
                                addnewChoice("fitness");
                              }}
                            >
                              ADD
                            </button>{" "}
                            <button
                              className="create_profile "
                              onClick={(e) => {
                                setaddMorefitnessChoices(false);
                                setnewfitnessError("");
                              }}
                            >
                              CANCEL
                            </button>
                          </div>
                        </>
                      ) : (
                        <a
                          style={{ cursor: "pointer" }}
                          onClick={() => addMore("fitness")}
                        >
                          + Add more
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </>
        ) : null}
        <div class="create_profile my-5 text-center">
          <button onClick={() => createProfile()}>Create Profile</button>
        </div>
      </div>
    </div>
  );
}

export default ArtistsProfile;
