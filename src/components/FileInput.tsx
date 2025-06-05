import React, { useRef, useState, ChangeEvent } from "react";
import "./FileInput.css";

interface FileInputProps {
    onFileSelect: (file: File) => void;  // Callback to pass the file up
}

const FileInput: React.FC<FileInputProps> = ({ onFileSelect }) => {

    const inputRef = useRef<HTMLInputElement | null>(null);


    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
            onFileSelect(e.target.files[0]);
        }
    };

    const triggerFileInput = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    return (
        <div>
            {/* Hidden file input element */}
            <input
                type="file"
                ref={inputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
            />

            {/* Button to trigger the file input */}
            <button
                className="file-btn"
                onClick={triggerFileInput}
            >
                <span className="material-symbols-rounded">upload</span>

            </button>

            {/* Display selected file name */}
          {/*   <div className="selected-file">
                <p>{selectedFile ? selectedFile.name : "Filnavn"}</p>
            </div>
            <div className="selected-file">
                <p>{selectedFile ? selectedFile.size : "Filstørrelse"}</p>
            </div>

             <div className="selected-file">
                <p>{selectedFile ? selectedFile.type : "Filtype"}</p>
            </div> */}

            {/* Another button (example functionality) */}
            {/*  <button>
                <span className="material-symbols-rounded">more_vert</span>
            </button> */}
        </div>
    );
};

export default FileInput;
