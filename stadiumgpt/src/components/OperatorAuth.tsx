import { useState } from "react";

export function OperatorAuth({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "sahil" && id.trim() !== "") {
      onAuthenticated();
    } else {
      setError("Invalid ID or Password");
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#EDDCD9] p-4 text-[#264143]">
      <div className="container-operator-auth">
        <form className="form_area" onSubmit={handleSubmit}>
          <p className="title">Control Room</p>
          <p className="sub_title">Authorized Personnel Only</p>
          <div className="form_group">
            <label className="sub_title" htmlFor="id">ID Number</label>
            <input 
              placeholder="Enter your ID" 
              className="form_style" 
              type="text" 
              id="id"
              value={id}
              onChange={e => setId(e.target.value)}
            />
          </div>
          <div className="form_group">
            <label className="sub_title" htmlFor="password">Secret Password</label>
            <input 
              placeholder="Enter secret password" 
              className="form_style" 
              type="password" 
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 font-bold text-sm mt-2">{error}</p>}
          <div>
            <button className="btn" type="submit">ACCESS</button>
          </div>
        </form>
      </div>
    </div>
  );
}
