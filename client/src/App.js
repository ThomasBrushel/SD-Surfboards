import './App.css';
import axios from 'axios'
import { useState, useEffect } from 'react';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import MapIcon from './Components/MapIcon';
import CalendarIcon from './Components/CalendarIcon';
import PriceTag from './Components/PriceTag';
import Hero from './Components/Hero';
import img from './images/singlefin.jpg'
import { v4 as uuidv4 } from 'uuid';



function App() {
  const [boards, setBoards] = useState();


  useEffect(() => {
    axios("/api/surfboards")
    .then(res => {
      setBoards(res.data.results)
     
    }).catch((error) => {
      console.error(error)
    })  
  }, [])


  if(!boards) {
    return null
  }

  const fadeProperties = {
    infinite: false,
    autoplay: false
  }

  return (
    <div>
      <Hero src={img} />
      <div className="App">

      {boards.map((item) => {
        let uuid = uuidv4();
        const showImage = () => {
            return (
              <div key={uuid}>
                {item.images.length === 1 &&
                  <img className='has-one-image' src={item.images}/>
                }
                {item.images.length > 1 &&
                  <div className="react-slide-container">
                    <Fade {...fadeProperties}>
                      {item.images.map((index, slideImage) => {
                        return (
                          <div className="each-slide" key={uuid}>
                            <img src={index} alt="" />
                          </div>
                        )
                      })}
                    </Fade>
                  </div>
                }
                {item.images.length < 1 &&
                  <div className='has-one-image' key={uuid}>
                    <img src="https://i.picsum.photos/id/643/200/300.jpg?hmac=rS-MHa0BIMHdAgm-FZ7QM36aRKEAzzhSRNRv5n4uqGc" alt="" />
                  </div>
                }
              </div>
            )
          }
          return(
            <div className='container' key={uuid}>
              <div className="col-4">
                {showImage()}
              </div>
              <div className="col-8 ml-2">
                <h1>{item.title}</h1>
                <p><MapIcon /> {item.location}</p>
                <p><CalendarIcon /> Posted {item.date}</p>
                <p className='item-price'><PriceTag /> {item.price}</p>
                <a className='btn-primary' href={item.postUrl} target="_blank">View Listing </a>
              </div>
            </div>
          )
      
      })}
        
       

      </div>
    </div>
  );
 
}

export default App;
