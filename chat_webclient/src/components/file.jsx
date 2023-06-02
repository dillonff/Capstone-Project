import React, { useState , useEffect} from "react";
import './Filemanage.css'
import {
  auth,
  callApi,
  getAllChannels,
  nullChannel,
  addUserToWorkspace,
  createChannel,
  nullWorkspace,
  getOrg,
  getOrgs,
  nullOrganization,
  getFile,
  getWorkspaceAll
} from '../api.js';
// import folderData from '../config/folderConfig'



const getMembersInfo = async (memberIds) => {
  const members = [];
  for (const id of memberIds) {
    let res = await callApi('/users/' + id, 'GET');
    if (res.ok) {
      res = await res.json();
      members.push(res);
    } else {
      console.error(res);
      alert('Cannot get user info');
      break;
    }
  }
  return members;
};



const App = () => {
  // const [selectedFolder, setSelectedFolder] = useState('1');
  let selectedFolder = '1'
  const [User, setUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFiles, setFilteredFiles] = useState([]);
  const userID = localStorage.getItem("userID"); 
  const [fileList,setFileList] = useState([]);
  const [fileId,setFileid] = useState(-1);
  const [folderData,setFolderData] =useState([]);
  const userCache = {};


  function getFileList() {
  getFile(fileId, selectedFolder,sortOptions).then((e)=>{
    setFileList(e)
  })
}

async function getUser(id, auth, refresh = false) {
  let user = userCache[id];
  if (!user || refresh) {
    let res = await callApi('/users/' + id, 'GET', auth);
    if (res.ok) {
      res = await res.json(); 
      userCache[res.id] = res;
      user = res;
    } else {
      throw new Error(`Cannot get user ${id}`);
    }
  }
  if (!user) {
    throw new Error(`Error getting user ${id}`);
  }
  return user;
}

  const handleFolderClick = (folder) => {
    console.log(folder.value, 'f');
    // setSelectedFolder(folder.value);
    selectedFolder = folder.value
    console.log(selectedFolder, 'select');
    // setFilteredFiles(folder.files);
    //.filter(filterRecentFiles));
    getFileList()
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    const filtered = selectedFolder.files.filter((file) => {
      const nameMatch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
      const uploadedByMatch = file.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
      const uploadedAtMatch = file.uploadedAt.toLowerCase().includes(searchTerm.toLowerCase());
      return nameMatch || uploadedByMatch || uploadedAtMatch;
    });
    setFilteredFiles(filtered);
  };

  const handleFileClick = (fileId) => {

    const fileContent = fetch(`/readFile.jsp?fileId=${fileId}`)
    //Path here
      .then((response) => response.text())
      .then((data) => {
        const newWindow = window.open();
        newWindow.document.write(<html><body><pre>${data}Filehere</pre></body></html>);
        newWindow.document.close();
      })
      .catch((error) => {
        console.error("Error reading file:", error);
      });
  };
  useEffect(()=>{
    getWorkspaceAll().then((e)=>{
      let workspaceList = [];
      e.map((item)=>{
        const obj = {
          id: item.id,
          name: item.name,
          value: item.id,
        }
        workspaceList.push(obj);
      })
      setFolderData(workspaceList);
    })
  },[])

  const [sortOptions, setSortOptions] = useState({});
  useEffect(()=>{
    getFileList()
  },[sortOptions])

  const handleSort = (field) => {

    setSortOptions((prevState) => ({
      [field]: prevState[field] === "asc" ? "desc" : "asc",
      sortField:field,
      sortOrder:prevState[field] === "asc" ? "desc" : "asc"
    }));
  };

  const sortFiles = (files, field) => {
    if (sortOptions[field] === "asc") {
      return [...files].sort((a, b) => {
        if (field === "uploadedBy") {
          return a[field].localeCompare(b[field]);
        } else if (field === "uploadedAt") {
          return new Date(b[field]) - new Date(a[field]);
        } else if(field === "name"){
          return a[field].localeCompare(b[field]);

        }
        return 0;
      });
    } else if (sortOptions[field] === "desc") {
      return [...files].sort((a, b) => {
        if (field === "uploadedBy") {
          return b[field].localeCompare(a[field]);
        } else if (field === "uploadedAt") {
          return new Date(a[field]) - new Date(b[field]);
        } else if(field === "name")
        {          return b[field].localeCompare(a[field]);
        }
        return 0;
      });
    }
    return files;
  };

  return (
    <div className="App">
      <div className="sidebar">
        <div className="sidebar-user">{User.name}</div>
        <div className="sidebar-folders">
          <ul>
            {folderData.map((folder) => (
              <li key={folder.id} onClick={() => handleFolderClick(folder)}>
                {folder.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="main">
        <div className="header">
          {selectedFolder ? (
            <div>{selectedFolder.name}</div>
          ) : (
            <div>Please select a folder</div>
          )}
        </div>
       
              <div className="files">
              <table>
  <thead>
    <tr>
      <th>Name{" "}
      <button
    className="sort-button"
    onClick={() => handleSort("name")}
  >
    <span className="sort-arrow">
      <span className={`arrow-up ${sortOptions.name === "asc" ? "active" : ""}`}>
        ↑
      </span>
      <span className={`arrow-down ${sortOptions.name === "desc" ? "active" : ""}`}>
        ↓
      </span>
    </span>
  </button>
  </th>
      <th>
  Uploaded By{" "}
  <button
    className="sort-button"
    onClick={() => handleSort("uploadedBy")}
  >
    <span className="sort-arrow">
      <span className={`arrow-up ${sortOptions.uploadedBy === "asc" ? "active" : ""}`}>
        ↑
      </span>
      <span className={`arrow-down ${sortOptions.uploadedBy === "desc" ? "active" : ""}`}>
        ↓
      </span>
    </span>
  </button>
</th>
<th>
  Uploaded At{" "}
  <button
    className="sort-button"
    onClick={() => handleSort("uploadedAt")}
  >
    <span className="sort-arrow">
      <span className={`arrow-up ${sortOptions.uploadedAt === "asc" ? "active" : ""}`}>
        ↑
      </span>
      <span className={`arrow-down ${sortOptions.uploadedAt === "desc" ? "active" : ""}`}>
        ↓
      </span>
    </span>
  </button>
</th>

      <th>Download</th>
    </tr>
  </thead>
  <tbody>
    {fileList.map((file) => (
      
      <tr
        key={file.id}
        className="file"
        onMouseEnter={(e) => e.target.classList.add("highlight")}
        onMouseLeave={(e) => e.target.classList.remove("highlight")}
      >
       <td className="file-name">
  {file.filename}
</td>

        <td>{file.uploaderName}</td>
        <td>{file.timeCreated}</td>
        <td>
        {new Date(file.timeCreated).getTime()+(90*24*60*60*1000) > new Date().getTime()?
       // <button  href={"http://127.0.0.1:11451/api/v1/files/" + file.id + "/" + encodeURIComponent(file.filename)}>Download</button>
       <a target="_blank" href={"http://127.0.0.1:11451/api/v1/files/" + file.id + "/" + encodeURIComponent(file.filename)}>Download</a>:
        <span></span>}
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
    </div>
    </div>
  );
};

export default App;
