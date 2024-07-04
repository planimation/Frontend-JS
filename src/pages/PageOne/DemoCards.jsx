import {useEffect, useState} from "react";
import axios from "axios";
import {Empty, Flex} from "antd";
import DemoCard from "./DemoCard";



const DemoCards = ({uploadFiles,closeGallery=()=>{}})=>{
   const [cardsInfo,setCardsInfo] = useState();

   useEffect(() => {
     // get all the subDirectory url from Github
     const owner = 'planimation';
     const repo = 'documentation';
     const path = 'AnimationProfiles';
     const branch = 'master';
     const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;

      axios.get(githubApiUrl,{
        headers:{
             Authorization: `token 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`
        }
      })
        .then(response => {
           const files = response.data;
           let folders = files.map(item=>{
              if(item.type=='dir'){
                 return {
                    name: item.name,
                    url: item.url
                 }
              }
           })
           setCardsInfo(folders.filter(item=>item))
        })

   }, []);

   return(
     <>
        {
           (!cardsInfo || cardsInfo.length == 0)
          ?  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          :<Flex justify={'center'} wrap={"wrap"} align={'center'} gap={40}>
                {
                   cardsInfo.map((item,index)=>{
                      return <DemoCard title={item.name} url={item.url} isFirstCard={index === 0}
                                       closeGallery={closeGallery}
                                       uploadFiles={uploadFiles}/>
                   })
                }
          </Flex>
        }

     </>
   )
}
export default DemoCards;
