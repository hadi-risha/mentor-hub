// on track

import { useEffect, useRef, useState } from "react";
import "./newPrompt.css";
import Upload from "../upload/Upload";
import { IKImage } from "imagekitio-react";
import model from "../../../../aiLib/gemini";
import Markdown from "react-markdown";  //for readability in answer
import axiosInstance from "../../../../utils/users/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";


const NewPrompt = ({ data }) => {
  const endRef = useRef(null);
  const userRole = localStorage.getItem("userRole");
  const formRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  });

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  // ***************** for testing purp *****************
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello i have 2 dogs in my house." }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. what would you like to know?" }],
      },
    ],
    generationConfig: {
      // maxOutputTokens: 100,
    },
  });

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer, img.dbData]);

  const mutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await axiosInstance.put(
          `/${userRole}/ai/chat/${data._id}`,
          {
            question: question.length ? question : undefined,
            answer,
            img: img.dbData?.filePath || undefined,
          }
        );
        console.log("response.data in ai newprompt ------", response.data);
        console.log(
          "response.data.updatedChat in ai newprompt ------0080",
          response.data.updatedChat
        );
        return response.data.updatedChat;
      } catch (error) {
        console.log("error in newPrompt :- ", error);
      }
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          formRef.current.reset();
          setQuestion("");
          setAnswer("");
          setImg({
            isLoading: false,
            error: "",
            dbData: {},
            aiData: {},
          });
        });
    },
    onError: (err) => {
      console.log("err in newprompt", err);
    },
  });

  const add = async (text, isInitial) => {
    //first run this function and get ai prompt answer then run the last given mutation function to save in db
    if (!isInitial) setQuestion(text);

    try {
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, text] : [text]
      );
      let accumulatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        console.log(chunkText);
        accumulatedText += chunkText;
        setAnswer(accumulatedText);
      }

      mutation.mutate();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;

    add(text, false);
  };

  // IN PRODUCTION WE DON'T NEED IT
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1) {
        add(data.history[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  }, []);

  return (
    <>
      {/* ADD NEW CHAT */}
      {img.isLoading && <div className="">Loading...</div>}
      {img.dbData?.filePath && (
        <IKImage
          // urlEndpoint={process.env.VITE_IMAGE_KIT_ENDPOINT}
          urlEndpoint="https://ik.imagekit.io/cfss1m3oa"
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]}
        />
      )}
      {question && <div className="message user">{question}</div>}
      {answer && (
        <div className="message">
          {" "}
          <Markdown>{answer}</Markdown>{" "}
        </div>
      )}

      {/* <button onClick={add}>TEST AI</button> */}
      <div className="endChat" ref={endRef}></div>

      <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden />
        <input type="text" name="text" placeholder="Ask anything..." />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
