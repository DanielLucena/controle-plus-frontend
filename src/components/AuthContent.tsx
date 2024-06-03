import React, { useState, useEffect } from 'react';
import { request, setAuthHeader } from '../helpers/axios_helper';

type fornecedor ={
    id: number;
    nome:string
}
const AuthContent: React.FC = () => {
  const [data, setData] = useState<fornecedor[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request("GET", "/fornecedor",{});
        setData(response.data);
      } catch (error: any) {
        if (error.response.status === 401) {
          setAuthHeader(null);
        } else {
          setData([error.response.code]);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div className="row justify-content-md-center">
      <div className="col-4">
        <div className="card" style={{ width: "18rem" }}>
          <div className="card-body">
            <h5 className="card-title">Backend response</h5>
            <p className="card-text">Content:</p>
            <ul>
              {data.map((line) => (
                <li key={line.id}>{line.nome}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContent;
