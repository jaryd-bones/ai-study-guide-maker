const FileUpload = ({ onFileSelected, accept = ".pdf,image/*" }) => {
  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onFileSelected) {
      onFileSelected(file);
    }
  }

  return (
    <div className="file-upload">
      <label className="btn btn-secondary">
        Choose file
        <input
          type="file"
          onChange={handleChange}
          accept={accept}
          style={{ display: "none" }}
        />
      </label>
    </div>
  );
}

export default FileUpload