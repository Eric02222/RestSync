import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="h-16 w-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center shadow-md mb-6 animate-bounce">
        <AlertCircle className="h-10 w-10" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
        404 - Página Não Encontrada
      </h1>
      <p className="mt-4 text-base text-slate-500 font-medium max-w-md leading-relaxed">
        A página que você está procurando não existe ou foi movida. Verifique a URL e tente novamente.
      </p>
      <div className="mt-8">
        <Button
          onClick={() => navigate('/dashboard')}
          variant="primary"
          className="shadow-lg shadow-blue-500/10 cursor-pointer"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Error;