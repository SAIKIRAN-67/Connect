import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { storage } from '../firebase.js';
import {ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
const Container = styled.div`
  max-width: 700px;
  margin: 50px auto;
  padding: 20px;
  background: linear-gradient(180deg, #e3f2fd, #f0f4c3);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  font-weight: 600;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #4a4a4a;
`;

const Input = styled.input`
  padding: 12px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #fff;
  &:focus {
    border-color: #007bff;
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  resize: none;
  height: 100px;
  background-color: #fff;
  &:focus {
    border-color: #007bff;
  }
`;

const Select = styled.select`
  padding: 12px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #fff;
  &:focus {
    border-color: #007bff;
  }
`;

const FileInput = styled.input`
  padding: 8px 0;
`;

const SubmitButton = styled.button`
  padding: 14px;
  font-size: 18px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const SuccessMessage = styled.p`
  color: #28a745;
  font-weight: 600;
  text-align: center;
  margin-top: 15px;
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
`;

const PreviewItem = styled.div`
  width: 100px;
  height: 100px;
  overflow: hidden;
  position: relative;
  border-radius: 5px;
  border: 1px solid #ddd;
  background-color: #fafafa;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoPreview = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

function PostProblem() {
  const [title, setTitle] = useState('');
  const [village,setVillage]=useState('');
  const [description, setDescription] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mobilenumber, setMobilenumber] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [category,setCategory]=useState("");
  const [loading, setLoading] = useState(false);
  const [willingness,setWillingness]=useState("");
  const [problemVisibility, setProblemVisibility] = useState("public");
  const constituencies={
    'Anantapur':["Rayadurg","Uravakonda","Guntakal","Tadipatri","Singanamala","Anantapur Urban","Kalyandurg","Raptadu"],
    'Sri Sathya Sai':["Madakasira","Hindupur","Penukonda","Puttaparthi","Dharmavaram","Kadiri"],
    'Annamayya':["Thamballapalle","Pileru","Madanapalle","Kodur","Rayachoti","Rajampet"],
    'Srikakulam':["Ichchapuram","Palasa","Tekkali","Pathapatnam","Srikakulam","Amdalavalasa","Etcherla","Narasannapeta"],
    'Vizianagaram':["Rajam","Bobbili","Cheepurupalli","Gajapathinagaram","Nellimarla","Vizianagaram","Srungavarapukota"],
    'Parvathipuram Manyam':["Palakonda","Kurupam","Parvathipuram","Salur"],
    'Visakhapatnam':["Bhimili","	Visakhapatnam East","Visakhapatnam South","Visakhapatnam North","	Visakhapatnam West","Gajuwaka"],
    'Anakapalli':["Chodavaram","Madugula","Anakapalle","Pendurthi","Elamanchili","Payakaraopet"],
    'Kakinada':["Tuni","Prathipadu","Pithapuram","Kakinada Rural","Peddapuram","Jaggampeta","Kakinada City"],
    'Alluri Sitharama Raju':["Araku Valley","Paderu","	Rampachodavaram",""],
    'East Godavari':["Anaparthy","Rajanagaram","Rajahmundry City","Rajahmundry Rural","Kovvur","Nidadavole","Gopalapuram"],
    'Konaseema':["Amalapuram","Razole","Gannavaram","Kothapeta","	Mandapeta"],
    'West Godavari':["Palakollu","Narasapuram","Bhimavaram","Undi","Tanuku","Tadepalligudem"],
    'Eluru':["Unguturu","Denduluru","Eluru","Kaikalur","Chintalapudi","Polavaram","Nuzvid"],
    'Krishna':["Pedana","Machilipatnam","Avanigadda","Pamarru","Gannavaram","Gudivada","Penamaluru"],
    "NTR":["Vijayawada West","Vijayawada Central","Vijayawada East","Mylavaram","Nandigama","Jaggayyapeta"],
    'Palnadu':["Pedakurapadu","Chilakaluripet","Narasaraopet","Sattenapalle","Vinukonda","Gurajala","Macherla"],
    'Prakasam':["Yerragondapalem","Darsi","Markapuram","Giddalur","Kanigiri","Santhanuthalapadu","Ongole"],
    'Nellore':["Kavali",'Atmakur',"Kovur","Nellore City","Nellore Rural","Sarvepalli","Udayagiri","Kandukur"],
    'Tirupati':["Gudur","Sullurpeta","Venkatagiri","Chandragiri","Tirupati","Srikalahasti","Sathyavedu"],
    'Kadapa':["Badvel","Pulivendla","Kamalapuram","Jammalamadugu","Proddatur","Mydukur","Kadapa",""],
    'Nandyal':["Srisailam","Panyam","Nandyal","Banaganapalle","Dhone"],
    'Kurnool':["Kodumur","Yemmiganur","Mantralayam","Adoni","Alur","Kurnool"],
    'Chittoor':["Punganur","Nagari","Gangadhara Nellore","Chittoor","Puthalapattu","Palamaner","Kuppam"]
  }
  const districts = Object.keys(constituencies);

  const handleFileChange = (e) => {
    setMediaFiles([...e.target.files]);
  };

  const uploadFilesToFirebase = async (files) => {
    const uploadPromises = files.map(async (file) => {
      const storageRef = ref(storage, `problems/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      return getDownloadURL(storageRef);
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload files to Firebase Storage
      const uploadedFileUrls = await uploadFilesToFirebase(mediaFiles);
      console.log("imgs:",uploadedFileUrls);
      // Retrieve email from cookies
      const email = Cookies.get('email'); // Assuming the cookie name is 'email'

      // Prepare form dat

      // Submit form data to your server
      const res = await axios.post('https://connect-aawd.onrender.com/api/problem/postproblem', {title,description,mobilenumber,email,images:uploadedFileUrls,district:selectedDistrict,constituency:selectedConstituency,category,details:willingness,village,problemvisibility:problemVisibility});
      console.log(res);
      setSuccessMessage('Problem submitted successfully!');
      setTitle('');
      setDescription('');
      setSelectedDistrict('');
      setSelectedConstituency('');
      setMobilenumber('');
      setProblemVisibility('');
      setWillingness();
      setMediaFiles([]);
    } catch (error) {
      console.error('Error submitting problem:', error);
    }
  };
  const navigate=useNavigate();
  useEffect(()=>{
    const user=Cookies.get("email");
    if(user=="" || user==null){
      navigate("/signin");
    }
    console.log(problemVisibility)
  },[problemVisibility])

  return (
    <Container>
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      <Title>Post a Problem</Title>
      <Form onSubmit={handleSubmit}>
        <Label>Select District</Label>
        <Select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          required
        >
          <option value="" disabled>Select a district</option>
          {districts.map((district, index) => (
            <option key={index} value={district}>
              {district}
            </option>
          ))}
        </Select>

        <Label>Select Constituency</Label>
        <Select
          value={selectedConstituency}
          onChange={(e) => setSelectedConstituency(e.target.value)}
          required
          disabled={!selectedDistrict}
        >
          <option value="" disabled>
            Select a constituency
          </option>
          {selectedDistrict &&
            constituencies[selectedDistrict]?.map((constituency, index) => (
              <option key={index} value={constituency}>
                {constituency}
              </option>
            ))}
        </Select>
        <Label>Village</Label>
        <Input
          type="text"
          value={village}
          onChange={(e) => setVillage(e.target.value)}
          required
          placeholder="Village"
          disabled={!selectedDistrict}
        />
        <Label>Category</Label>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="" disabled>
            Select a category
          </option>
          <option>Personal</option>
          <option>Community</option>
          <option>Student</option>
        </Select>
        {category === 'Personal' && (
          <>
             <Label>Problem Visibility</Label>
          <Select value={problemVisibility} onChange={(e) => setProblemVisibility(e.target.value)} required>
              <option value="" disabled>Select visibility</option>
              <option >Public</option>
              <option>Higher Officials</option>
           </Select>
         </>
       )}
        <Label>Problem Title</Label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter problem title"
        />

        <Label>Problem Description</Label>
        <TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Describe the problem in detail"
        />
        <Label>Upload Images/Videos (optional)</Label>
        <FileInput
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          multiple
        />

        <PreviewContainer>
          {mediaFiles.map((file, index) => (
            <PreviewItem key={index}>
              {file.type.startsWith('image') ? (
                <ImagePreview src={URL.createObjectURL(file)} alt="Preview" />
              ) : (
                <VideoPreview src={URL.createObjectURL(file)} controls />
              )}
            </PreviewItem>
          ))}
        </PreviewContainer>
        <Label>Mobile Number</Label>
        <Input
          type="number"
          value={mobilenumber}
          onChange={(e) => setMobilenumber(e.target.value)}
          required
        /> 
        <Label>Willing to display mobilenumber</Label>
        <Select
          value={willingness}
          onChange={(e) => setWillingness(e.target.value)}
          required
        >
          <option value="" disabled>
            Select
          </option>
          <option>Yes</option>
          <option>No</option>
        </Select>
        <SubmitButton type="submit">Submit Problem</SubmitButton>
      </Form>
    </Container>
  );
}

export default PostProblem;
// import React, { useEffect, useState } from 'react';
// import styled from 'styled-components';
// import axios from 'axios';
// import { storage } from '../firebase.js';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import Cookies from 'js-cookie';
// import { useNavigate } from 'react-router-dom';

// const Container = styled.div`
//   max-width: 700px;
//   margin: 50px auto;
//   padding: 20px;
//   background: linear-gradient(180deg, #e3f2fd, #f0f4c3);
//   box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
//   border-radius: 8px;
// `;

// const Title = styled.h2`
//   text-align: center;
//   color: #333;
//   font-weight: 600;
//   margin-bottom: 20px;
// `;

// const Form = styled.form`
//   display: flex;
//   flex-direction: column;
//   gap: 15px;
// `;

// const Label = styled.label`
//   font-weight: 600;
//   color: #4a4a4a;
// `;

// const Input = styled.input`
//   padding: 12px;
//   font-size: 16px;
//   border-radius: 5px;
//   border: 1px solid #ccc;
//   background-color: #fff;
//   &:focus {
//     border-color: #007bff;
//   }
// `;

// const TextArea = styled.textarea`
//   padding: 12px;
//   font-size: 16px;
//   border-radius: 5px;
//   border: 1px solid #ccc;
//   resize: none;
//   height: 100px;
//   background-color: #fff;
//   &:focus {
//     border-color: #007bff;
//   }
// `;

// const Select = styled.select`
//   padding: 12px;
//   font-size: 16px;
//   border-radius: 5px;
//   border: 1px solid #ccc;
//   background-color: #fff;
//   &:focus {
//     border-color: #007bff;
//   }
// `;

// const SubmitButton = styled.button`
//   padding: 14px;
//   font-size: 18px;
//   color: #fff;
//   background-color: #007bff;
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;
//   font-weight: bold;
//   transition: background-color 0.3s ease;

//   &:hover {
//     background-color: #0056b3;
//   }
// `;

// const SuccessMessage = styled.p`
//   color: #28a745;
//   font-weight: 600;
//   text-align: center;
//   margin-top: 15px;
// `;

// function PostProblem() {
//   const [title, setTitle] = useState('');
//   const [village, setVillage] = useState('');
//   const [description, setDescription] = useState('');
//   const [selectedDistrict, setSelectedDistrict] = useState('');
//   const [selectedConstituency, setSelectedConstituency] = useState('');
//   const [mobilenumber, setMobilenumber] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [category, setCategory] = useState('');
//   const [willingness, setWillingness] = useState('');
//   const [problemVisibility, setProblemVisibility] = useState('');
  
//   const handleCategoryChange = (e) => {
//     setCategory(e.target.value);
//     if (e.target.value !== 'Personal') {
//       setProblemVisibility('');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const email = Cookies.get('email'); 
//       const res = await axios.post('https://connect-aawd.onrender.com/api/problem/postproblem', {
//         title,
//         description,
//         mobilenumber,
//         email,
//         district: selectedDistrict,
//         constituency: selectedConstituency,
//         category,
//         details: willingness,
//         village,
//         problemVisibility: category === "Personal" ? problemVisibility : undefined
//       });

//       console.log(res);
//       setSuccessMessage('Problem submitted successfully!');
//       setTitle('');
//       setDescription('');
//       setSelectedDistrict('');
//       setSelectedConstituency('');
//     } catch (error) {
//       console.error('Error submitting problem:', error);
//     }
//   };

//   return (
//     <Container>
//       {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
//       <Title>Post a Problem</Title>
//       <Form onSubmit={handleSubmit}>
//         <Label>Select District</Label>
//         <Select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} required>
//           <option value="" disabled>Select a district</option>
//           {/* Add district options here */}
//         </Select>

//         <Label>Select Constituency</Label>
//         <Select value={selectedConstituency} onChange={(e) => setSelectedConstituency(e.target.value)} required disabled={!selectedDistrict}>
//           <option value="" disabled>Select a constituency</option>
//           {/* Add constituency options here */}
//         </Select>

//         <Label>Village</Label>
//         <Input type="text" value={village} onChange={(e) => setVillage(e.target.value)} required placeholder="Village" disabled={!selectedDistrict} />

//         <Label>Category</Label>
//         <Select value={category} onChange={handleCategoryChange} required>
//           <option value="" disabled>Select a category</option>
//           <option>Personal</option>
//           <option>Community</option>
//           <option>Student</option>
//         </Select>

//         {/* Conditionally render Problem Visibility field */}
//         {category === 'Personal' && (
//           <>
//             <Label>Problem Visibility</Label>
//             <Select value={problemVisibility} onChange={(e) => setProblemVisibility(e.target.value)} required>
//               <option value="" disabled>Select visibility</option>
//               <option value={}>Public</option>
//               <option>Higher Officials</option>
//             </Select>
//           </>
//         )}

//         <Label>Problem Title</Label>
//         <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Enter problem title" />

//         <Label>Problem Description</Label>
//         <TextArea value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Describe the problem in detail" />

//         <Label>Mobile Number</Label>
//         <Input type="number" value={mobilenumber} onChange={(e) => setMobilenumber(e.target.value)} required />

//         <Label>Willing to display mobile number</Label>
//         <Select value={willingness} onChange={(e) => setWillingness(e.target.value)} required>
//           <option value="" disabled>Select</option>
//           <option>Yes</option>
//           <option>No</option>
//         </Select>

//         <SubmitButton type="submit">Submit Problem</SubmitButton>
//       </Form>
//     </Container>
//   );
// }

// export default PostProblem;
