package com.sistemaClinica.paciente.util;

public final class CpfUtils {

    private CpfUtils() {
    }

    public static String manterApenasDigitos(String cpf) {
        return cpf == null ? "" : cpf.replaceAll("\\D", "");
    }

    public static boolean isCpfValido(String cpf) {
        String digitos = manterApenasDigitos(cpf);

        if (digitos.length() != 11) {
            return false;
        }

        if (digitos.chars().distinct().count() == 1) {
            return false;
        }

        int primeiroDigito = calcularDigitoVerificador(digitos.substring(0, 9), 10);
        int segundoDigito = calcularDigitoVerificador(digitos.substring(0, 9) + primeiroDigito, 11);

        return digitos.equals(digitos.substring(0, 9) + primeiroDigito + segundoDigito);
    }

    public static String formatarCpf(String cpf) {
        String digitos = manterApenasDigitos(cpf);
        if (digitos.length() != 11) {
            throw new IllegalArgumentException("CPF deve conter 11 dígitos.");
        }
        return digitos.substring(0, 3) + "." + digitos.substring(3, 6) + "." + digitos.substring(6, 9) + "-" + digitos.substring(9);
    }

    private static int calcularDigitoVerificador(String cpfParcial, int pesoInicial) {
        int soma = 0;
        for (int i = 0; i < cpfParcial.length(); i++) {
            soma += Character.getNumericValue(cpfParcial.charAt(i)) * (pesoInicial - i);
        }
        int resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    }
}
