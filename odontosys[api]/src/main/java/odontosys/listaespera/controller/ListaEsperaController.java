package com.sistemaClinica.listaespera.controller;

import com.sistemaClinica.listaespera.dto.ListaEsperaDTO;
import com.sistemaClinica.listaespera.service.ListaEsperaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lista-espera")
public class ListaEsperaController {

    private final ListaEsperaService listaEsperaService;

    public ListaEsperaController(ListaEsperaService listaEsperaService) {
        this.listaEsperaService = listaEsperaService;
    }

    @GetMapping
    public List<ListaEsperaDTO> listarTodas() {
        return listaEsperaService.listarTodas();
    }

    @GetMapping("/ativas")
    public List<ListaEsperaDTO> listarAtivas() {
        return listaEsperaService.listarAtivas();
    }

    @PostMapping
    public ListaEsperaDTO criar(@RequestBody ListaEsperaDTO listaEsperaDTO) {
        return listaEsperaService.salvar(listaEsperaDTO);
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<ListaEsperaDTO> cancelar(@PathVariable String id) {
        return ResponseEntity.ok(listaEsperaService.cancelar(id));
    }
}
