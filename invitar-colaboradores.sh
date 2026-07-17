#!/bin/bash
# INVITACIONES ZAFIRO — Ejecutar cuando los usuarios existan en GitHub
# Creado: 2026-07-17

gh api repos/MSM2024/MSM-Zafiro/collaborators/msm-dev-369 -X PUT && echo 'Invitado: msm-dev-369'
gh api repos/MSM2024/MSM-Zafiro/collaborators/zafiro-builder -X PUT && echo 'Invitado: zafiro-builder'
gh api repos/MSM2024/MSM-Zafiro/collaborators/eliana-nodo -X PUT && echo 'Invitado: eliana-nodo'
gh api repos/MSM2024/MSM-Zafiro/collaborators/colaborador-msm -X PUT && echo 'Invitado: colaborador-msm'
