package com.sistemaClinica.financeiro.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.sistemaClinica.financeiro.model.LancamentoFinanceiro;
import com.sistemaClinica.financeiro.repository.LancamentoFinanceiroRepository;
import com.sistemaClinica.shared.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
public class ReciboService {

    private final LancamentoFinanceiroRepository lancamentoRepository;

    public ReciboService(LancamentoFinanceiroRepository lancamentoRepository) {
        this.lancamentoRepository = lancamentoRepository;
    }

    public byte[] gerarRecibo(String idLancamento) {
        LancamentoFinanceiro lancamento = lancamentoRepository.findById(idLancamento)
                .orElseThrow(() -> new ResourceNotFoundException("Lancamento nao encontrado"));

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = new Font(Font.HELVETICA, 22, Font.BOLD, new Color(37, 99, 235));
            Paragraph title = new Paragraph("OdontoSys", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Font subtitleFont = new Font(Font.HELVETICA, 14, Font.BOLD, Color.BLACK);
            Paragraph subtitle = new Paragraph("Recibo de Pagamento", subtitleFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(24);
            document.add(subtitle);

            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10);
            table.setWidths(new float[]{2, 4});

            Font labelFont = new Font(Font.HELVETICA, 11, Font.BOLD, new Color(71, 85, 105));
            Font valueFont = new Font(Font.HELVETICA, 11, Font.NORMAL, Color.BLACK);

            addRow(table, "Numero:", lancamento.getIdLancamento(), labelFont, valueFont);
            addRow(table, "Data:", lancamento.getData() != null
                    ? lancamento.getData().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "-", labelFont, valueFont);
            addRow(table, "Descricao:", lancamento.getDescricao(), labelFont, valueFont);
            addRow(table, "Valor:", NumberFormat.getCurrencyInstance(new Locale("pt", "BR"))
                    .format(lancamento.getValor()), labelFont, valueFont);
            addRow(table, "Status:", lancamento.getStatus() != null ? lancamento.getStatus().name() : "-", labelFont, valueFont);

            if (lancamento.getPaciente() != null) {
                addRow(table, "Paciente:", lancamento.getPaciente().getNome(), labelFont, valueFont);
            }
            if (lancamento.getObservacoes() != null && !lancamento.getObservacoes().isBlank()) {
                addRow(table, "Observacoes:", lancamento.getObservacoes(), labelFont, valueFont);
            }

            document.add(table);

            Font footerFont = new Font(Font.HELVETICA, 9, Font.ITALIC, new Color(148, 163, 184));
            Paragraph footer = new Paragraph("Documento gerado automaticamente pelo sistema OdontoSys.", footerFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            footer.setSpacingBefore(32);
            document.add(footer);

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar recibo PDF", e);
        }
    }

    private void addRow(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, labelFont));
        labelCell.setBorder(Rectangle.BOTTOM);
        labelCell.setPadding(9);
        labelCell.setBackgroundColor(new Color(248, 250, 252));
        table.addCell(labelCell);

        PdfPCell valueCell = new PdfPCell(new Phrase(value != null ? value : "-", valueFont));
        valueCell.setBorder(Rectangle.BOTTOM);
        valueCell.setPadding(9);
        table.addCell(valueCell);
    }
}
