package com.msm.mesh.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.msm.mesh.mesh.MeshGateway
import com.msm.mesh.mesh.MeshNode
import com.msm.mesh.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GatewayScreen(navController: NavController) {
    val node = remember { MeshNode.getInstance() }
    val gateway = remember { MeshGateway(node) }
    val isActive by gateway.isGatewayActive.collectAsState()
    val clients by gateway.connectedClients.collectAsState()
    val relayed by gateway.relayedMessages.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Modo Gateway", fontSize = 16.sp) },
                navigationIcon = {
                    TextButton(onClick = { navController.popBackStack() }) { Text("←") }
                },
            )
        }
    ) { padding ->
        Column(
            Modifier.fillMaxSize().padding(padding).padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Card(
                colors = CardDefaults.cardColors(containerColor = DarkCard),
                modifier = Modifier.fillMaxWidth(),
            ) {
                Column(Modifier.padding(16.dp)) {
                    Text("Gateway Mesh", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Cyan500)
                    Spacer(Modifier.height(12.dp))
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Estado", fontSize = 12.sp, color = TextSecondary)
                        Text(
                            if (isActive) "Activo" else "Inactivo",
                            fontSize = 12.sp,
                            color = if (isActive) Emerald400 else TextSecondary,
                            fontWeight = FontWeight.Bold,
                        )
                    }
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Clientes", fontSize = 12.sp, color = TextSecondary)
                        Text("${clients.size}", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Mensajes retransmitidos", fontSize = 12.sp, color = TextSecondary)
                        Text("$relayed", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            Spacer(Modifier.height(24.dp))

            Button(
                onClick = { if (isActive) gateway.deactivate() else gateway.activate() },
                modifier = Modifier.fillMaxWidth().height(48.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isActive) Red400 else Cyan500,
                ),
            ) {
                Text(if (isActive) "Desactivar Gateway" else "Activar Gateway")
            }

            if (clients.isNotEmpty()) {
                Spacer(Modifier.height(16.dp))
                Text("Clientes conectados", fontSize = 12.sp, color = TextSecondary)
                Spacer(Modifier.height(8.dp))
                clients.forEach { client ->
                    Card(
                        colors = CardDefaults.cardColors(containerColor = DarkCard),
                        modifier = Modifier.fillMaxWidth().padding(vertical = 2.dp),
                    ) {
                        Text(
                            "${client.displayName} (${client.nodeId})",
                            Modifier.padding(12.dp),
                            fontSize = 12.sp,
                        )
                    }
                }
            }
        }
    }
}
