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
import com.msm.mesh.mesh.MeshNode
import com.msm.mesh.ui.theme.Cyan500
import com.msm.mesh.ui.theme.TextSecondary

@Composable
fun MainScreen(navController: NavController) {
    val node = remember { MeshNode.getInstance() }
    val nodeInfo by node.nodeInfo.collectAsState()
    val role by node.role.collectAsState()
    val nodeCount by node.discoveredNodes.collectAsState()

    Column(
        modifier = Modifier.fillMaxSize().padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Spacer(Modifier.height(48.dp))

        Text("MSM Mesh", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = Cyan500)
        Text("v${nodeInfo.meshVersion}", fontSize = 12.sp, color = TextSecondary)

        Spacer(Modifier.height(32.dp))

        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
        ) {
            Column(Modifier.padding(16.dp)) {
                InfoRow("Nodo ID", nodeInfo.nodeId)
                InfoRow("Dispositivo", nodeInfo.deviceName)
                InfoRow("Rol", role.label)
                InfoRow("Nodos vistos", "${nodeCount.size}")
            }
        }

        Spacer(Modifier.height(24.dp))

        Button(
            onClick = { navController.navigate("discovery") },
            modifier = Modifier.fillMaxWidth().height(48.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Cyan500),
        ) { Text("Descubrir Nodos") }

        Spacer(Modifier.height(12.dp))

        OutlinedButton(
            onClick = { navController.navigate("gateway") },
            modifier = Modifier.fillMaxWidth().height(48.dp),
        ) { Text("Modo Gateway") }
    }
}

@Composable
private fun InfoRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        Text(label, fontSize = 13.sp, color = TextSecondary)
        Text(value, fontSize = 13.sp, fontWeight = FontWeight.Medium)
    }
}
