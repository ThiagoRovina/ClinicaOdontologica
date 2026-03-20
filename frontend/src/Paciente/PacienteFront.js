import React, { useState } from 'react';


const RadioButton = ({ id, name, label, onChange, defaultChecked = false }) => (
    <>
        <input
            type="radio"
            id={id}
            name={name}
            className="hidden peer"
            onChange={onChange}
            defaultChecked={defaultChecked}
        />
        <label
            htmlFor={id}
            className="flex items-center justify-center cursor-pointer py-2 px-4 rounded-lg border border-gray-300 transition-all duration-200 hover:bg-gray-50 peer-checked:bg-blue-50 peer-checked:border-blue-500 peer-checked:font-medium text-sm"
        >
            {label}
        </label>
    </>
);

export default function App() {
    const [showMedDetails, setShowMedDetails] = useState(false);
    const [showAllergyDetails, setShowAllergyDetails] = useState(false);
    const [cpf, setCpf] = useState('');

    const somenteDigitos = (value) => value.replace(/\D/g, '');

    const formatarCpf = (value) => {
        const digits = somenteDigitos(value).slice(0, 11);
        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
        if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
        return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
    };

    const cpfValido = (value) => {
        const digits = somenteDigitos(value);
        if (digits.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(digits)) return false;

        const calc = (base, pesoInicial) => {
            let soma = 0;
            for (let i = 0; i < base.length; i++) {
                soma += Number(base[i]) * (pesoInicial - i);
            }
            const resto = soma % 11;
            return resto < 2 ? 0 : 11 - resto;
        };

        const d1 = calc(digits.slice(0, 9), 10);
        const d2 = calc(`${digits.slice(0, 9)}${d1}`, 11);
        return digits === `${digits.slice(0, 9)}${d1}${d2}`;
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        if (!cpfValido(cpf)) {
            alert('CPF inválido. Informe um CPF válido.');
            return;
        }
        alert('Paciente cadastrado com sucesso! (Simulação)');
    };

    return (
        <div className="bg-gray-50 text-gray-800" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">

                <header className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-blue-600">Ficha de Cadastro de Paciente</h1>
                    <p className="text-gray-500 mt-2">Preencha os dados abaixo com atenção.</p>
                </header>

                <form className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg space-y-8" onSubmit={handleSubmit}>

                    {/* Seção 1: Dados Pessoais */}
                    <fieldset className="border-l-4 border-blue-500 pl-6">
                        <legend className="text-xl font-semibold text-gray-700 mb-6">1. Dados Pessoais</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="full-name" className="block text-sm font-medium text-gray-600 mb-1">Nome Completo</label>
                                <input type="text" id="full-name" name="full-name" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition" />
                            </div>
                            <div>
                                <label htmlFor="birth-date" className="block text-sm font-medium text-gray-600 mb-1">Data de Nascimento</label>
                                <input type="date" id="birth-date" name="birth-date" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition" />
                            </div>
                            <div>
                                <label htmlFor="cpf" className="block text-sm font-medium text-gray-600 mb-1">CPF</label>
                                <input
                                    type="text"
                                    id="cpf"
                                    name="cpf"
                                    placeholder="000.000.000-00"
                                    value={cpf}
                                    onChange={(e) => setCpf(formatarCpf(e.target.value))}
                                    maxLength={14}
                                    pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                                />
                            </div>
                            <div>
                                <label htmlFor="rg" className="block text-sm font-medium text-gray-600 mb-1">RG</label>
                                <input type="text" id="rg" name="rg" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition" />
                            </div>
                            <div>
                                <label htmlFor="occupation" className="block text-sm font-medium text-gray-600 mb-1">Profissão</label>
                                <input type="text" id="occupation" name="occupation" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition" />
                            </div>
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-600 mb-1">Gênero</label>
                                <select id="gender" name="gender" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition">
                                    <option>Feminino</option>
                                    <option>Masculino</option>
                                    <option>Outro</option>
                                    <option>Prefiro não informar</option>
                                </select>
                            </div>
                        </div>
                    </fieldset>

                    {/* Seção 2: Contato */}
                    <fieldset className="border-l-4 border-blue-500 pl-6">
                        <legend className="text-xl font-semibold text-gray-700 mb-6">2. Informações de Contato</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-600 mb-1">Endereço Completo</label>
                                <input type="text" id="address" name="address" placeholder="Rua, Número, Bairro, Cidade - Estado" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition" />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1">Telefone Celular (WhatsApp)</label>
                                <input type="tel" id="phone" name="phone" placeholder="(00) 90000-0000" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">E-mail</label>
                                <input type="email" id="email" name="email" placeholder="seu.email@exemplo.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition" />
                            </div>
                        </div>
                    </fieldset>

                    {/* Seção 3: Anamnese (Histórico de Saúde) */}
                    <fieldset className="border-l-4 border-blue-500 pl-6">
                        <legend className="text-xl font-semibold text-gray-700 mb-6">3. Histórico de Saúde (Anamnese)</legend>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Qual o motivo principal da sua consulta?</label>
                                <textarea name="main-complaint" rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Ex: Dor de dente, check-up, clareamento, etc."></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Está em tratamento médico ou toma algum medicamento de uso contínuo?</label>
                                <div className="flex gap-4">
                                    <RadioButton id="med-yes" name="medication" label="Sim" onChange={() => setShowMedDetails(true)} />
                                    <RadioButton id="med-no" name="medication" label="Não" onChange={() => setShowMedDetails(false)} defaultChecked />
                                </div>
                                {showMedDetails && (
                                    <input type="text" name="medication-details" className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Se sim, quais?" />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Possui alguma alergia (a medicamentos, anestésicos, etc.)?</label>
                                <div className="flex gap-4">
                                    <RadioButton id="allergy-yes" name="allergy" label="Sim" onChange={() => setShowAllergyDetails(true)} />
                                    <RadioButton id="allergy-no" name="allergy" label="Não" onChange={() => setShowAllergyDetails(false)} defaultChecked />
                                </div>
                                {showAllergyDetails && (
                                    <input type="text" name="allergy-details" className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Se sim, quais?" />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Tem ou já teve alguma das seguintes condições?</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                                    <label className="flex items-center"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2" />Diabetes</label>
                                    <label className="flex items-center"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2" />Pressão Alta</label>
                                    <label className="flex items-center"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2" />Problemas Cardíacos</label>
                                    <label className="flex items-center"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2" />Asma</label>
                                    <label className="flex items-center"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2" />Hepatite</label>
                                    <label className="flex items-center"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2" />Problemas de Coagulação</label>
                                </div>
                            </div>

                            <div className="pt-2">
                                <label className="block text-sm font-medium text-gray-600 mb-2">Para mulheres: está grávida ou amamentando?</label>
                                <div className="flex gap-4">
                                    <RadioButton id="preg-yes" name="pregnant" label="Sim" />
                                    <RadioButton id="preg-no" name="pregnant" label="Não" defaultChecked />
                                    <RadioButton id="preg-na" name="pregnant" label="Não se aplica" />
                                </div>
                            </div>
                        </div>
                    </fieldset>

                    {/* Seção 4: Histórico Odontológico */}
                    <fieldset className="border-l-4 border-blue-500 pl-6">
                        <legend className="text-xl font-semibold text-gray-700 mb-6">4. Histórico Odontológico</legend>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Sua gengiva sangra ao escovar ou usar fio dental?</label>
                                <div className="flex gap-4">
                                    <RadioButton id="gum-yes" name="gum-bleed" label="Sim" />
                                    <RadioButton id="gum-no" name="gum-bleed" label="Não" defaultChecked />
                                    <RadioButton id="gum-sometimes" name="gum-bleed" label="Às vezes" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Você range ou aperta os dentes (bruxismo)?</label>
                                <div className="flex gap-4">
                                    <RadioButton id="bruxism-yes" name="bruxism" label="Sim" />
                                    <RadioButton id="bruxism-no" name="bruxism" label="Não" defaultChecked />
                                    <RadioButton id="bruxism-unsure" name="bruxism" label="Não sei" />
                                </div>
                            </div>
                        </div>
                    </fieldset>

                    {/* Seção 5: Consentimento */}
                    <fieldset>
                        <div className="space-y-4 pt-4 border-t border-gray-200 mt-8">
                            <label className="flex items-start">
                                <input type="checkbox" required className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1 mr-3 shrink-0" />
                                <span className="text-sm text-gray-600">Declaro que as informações fornecidas nesta ficha são verdadeiras e completas.</span>
                            </label>
                            <label className="flex items-start">
                                <input type="checkbox" required className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1 mr-3 shrink-0" />
                                <span className="text-sm text-gray-600">Autorizo a realização de exames clínicos e radiográficos necessários para o diagnóstico e planejamento do meu tratamento.</span>
                            </label>
                        </div>
                    </fieldset>

                    {/* Botão de Envio */}
                    <div className="pt-6 text-right">
                        <button type="submit" className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300">
                            Finalizar Cadastro
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
