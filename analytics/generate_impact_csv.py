import csv
import numpy as np
from pathlib import Path
import time

"""
Script: generate_impact_csv_100k.py

Genera un archivo CSV con 100,000 registros de métricas simuladas de "antes" y "después"
de la plataforma Ancestral heartbeat.

Mantiene distribuciones realistas y relaciones entre métricas.
"""

# Configuración de la generación de datos
TOTAL_RECORDS = 100_000  # 100 mil registros
BATCH_SIZE = 10_000  # Escribir en lotes para eficiencia

# Definiciones base ampliadas
COMMUNITIES = [
    {"name": "Comunidad Wayuu", "region": "La Guajira", "category": "Mochilas"},
    {"name": "Tejidos del Caribe", "region": "Atlántico", "category": "Sombreros"},
    {"name": "Hamacas del Magdalena", "region": "Magdalena", "category": "Hamacas"},
    {"name": "Cerámica Andina", "region": "Cundinamarca", "category": "Decoración"},
    {"name": "Artesanos del Pacífico", "region": "Chocó", "category": "Maderas"},
    {"name": "Tejedoras de Nariño", "region": "Nariño", "category": "Textiles"},
    {"name": "Orfebres de Antioquia", "region": "Antioquia", "category": "Joyas"},
    {"name": "Cestería Amazonas", "region": "Amazonas", "category": "Cestería"},
    {"name": "Lana de Boyacá", "region": "Boyacá", "category": "Textiles"},
    {"name": "Cuero del Valle", "region": "Valle del Cauca", "category": "Marroquinería"},
    {"name": "Bordados de Santander", "region": "Santander", "category": "Textiles"},
    {"name": "Máscaras del Putumayo", "region": "Putumayo", "category": "Decoración"},
    {"name": "Tejidos del Cauca", "region": "Cauca", "category": "Textiles"},
    {"name": "Cerámica de La Paz", "region": "Cesar", "category": "Decoración"},
    {"name": "Sombreros Aguadeños", "region": "Caldas", "category": "Sombreros"},
]

# Factores de crecimiento por tipo de artesanía
CATEGORY_FACTORS = {
    "Mochilas": 1.3,
    "Sombreros": 1.2,
    "Hamacas": 1.4,
    "Decoración": 1.1,
    "Textiles": 1.25,
    "Joyas": 1.35,
    "Cestería": 1.15,
    "Maderas": 1.2,
    "Marroquinería": 1.3,
}

# Parámetros base para generación de datos
BASE_PARAMS = {
    "before": {
        "year_range": (2021, 2023),
        "artisans_range": (5, 40),
        "orders_multiplier_range": (2, 8),
        "pieces_per_order_range": (1.2, 2.0),
        "price_range_cop": (150_000, 500_000),
        "fair_trade_range": (0.0, 5.0),
        "export_range": (2.0, 20.0),
    },
    "after": {
        "year_range": (2024, 2026),
        "artisans_range": (15, 80),
        "orders_multiplier_range": (4, 10),
        "pieces_per_order_range": (1.5, 2.5),
        "price_range_cop": (200_000, 700_000),
        "fair_trade_range": (8.0, 25.0),
        "export_range": (15.0, 45.0),
    }
}

def generate_community_data(community_info, period, n_records):
    """Genera datos para una comunidad específica."""
    params = BASE_PARAMS[period]
    
    data = []
    for _ in range(n_records):
        # Año con distribución normal (más registros en años centrales)
        year_range = params["year_range"]
        year = int(np.random.normal(
            loc=(year_range[0] + year_range[1]) / 2,
            scale=(year_range[1] - year_range[0]) / 4
        ))
        year = max(year_range[0], min(year_range[1], year))
        
        # Artesanos activos
        artisans_base = np.random.randint(params["artisans_range"][0], params["artisans_range"][1])
        seasonal_factor = 0.8 + 0.4 * np.random.random()  # Variación estacional
        artisans_active = int(artisans_base * seasonal_factor)
        
        # Pedidos (relacionado con artesanos)
        orders_multiplier = np.random.uniform(*params["orders_multiplier_range"])
        orders = int(artisans_active * orders_multiplier * (0.8 + 0.4 * np.random.random()))
        
        # Piezas vendidas
        pieces_per_order = np.random.uniform(*params["pieces_per_order_range"])
        pieces_sold = int(orders * pieces_per_order)
        
        # Precio promedio
        base_price = np.random.uniform(*params["price_range_cop"])
        category_factor = CATEGORY_FACTORS.get(community_info["category"], 1.0)
        avg_price_cop = int(base_price * category_factor)
        
        # Ingresos totales
        revenue_cop = int(pieces_sold * avg_price_cop)
        
        # Comercio justo (más alto en periodo "after")
        if period == "before":
            fair_trade_chance = 0.3  # Solo 30% de registros tienen comercio justo antes
            if np.random.random() < fair_trade_chance:
                fair_trade_premium_pct = round(np.random.uniform(*params["fair_trade_range"]), 1)
            else:
                fair_trade_premium_pct = 0.0
        else:
            fair_trade_chance = 0.8  # 80% tienen comercio justo después
            if np.random.random() < fair_trade_chance:
                fair_trade_premium_pct = round(np.random.uniform(*params["fair_trade_range"]), 1)
            else:
                fair_trade_premium_pct = 0.0
        
        # Exportaciones
        export_base = np.random.uniform(*params["export_range"])
        # Comunidades de ciertas regiones exportan más
        if community_info["region"] in ["La Guajira", "Atlántico", "Magdalena"]:
            export_share_pct = min(100.0, round(export_base * 1.3, 1))
        else:
            export_share_pct = round(export_base, 1)
        
        data.append({
            "period": period,
            "year": year,
            "community": community_info["name"],
            "region": community_info["region"],
            "category": community_info["category"],
            "artisans_active": max(1, artisans_active),
            "orders": max(1, orders),
            "pieces_sold": max(1, pieces_sold),
            "revenue_cop": max(100_000, revenue_cop),
            "avg_price_cop": max(50_000, avg_price_cop),
            "fair_trade_premium_pct": min(30.0, max(0.0, fair_trade_premium_pct)),
            "export_share_pct": min(100.0, max(0.0, export_share_pct)),
        })
    
    return data

def print_statistics(data):
    """Imprime estadísticas básicas de los datos generados."""
    if not data:
        return
    
    before_data = [d for d in data if d["period"] == "before"]
    after_data = [d for d in data if d["period"] == "after"]
    
    print("\n" + "="*60)
    print("ESTADÍSTICAS DE LOS DATOS GENERADOS")
    print("="*60)
    
    for period_name, period_data in [("ANTES", before_data), ("DESPUÉS", after_data)]:
        if period_data:
            print(f"\n{period_name} ({len(period_data):,} registros):")
            
            # Convertir a arrays numpy para cálculos eficientes
            artisans = np.array([d["artisans_active"] for d in period_data])
            revenues = np.array([d["revenue_cop"] for d in period_data])
            prices = np.array([d["avg_price_cop"] for d in period_data])
            fair_trade = np.array([d["fair_trade_premium_pct"] for d in period_data])
            exports = np.array([d["export_share_pct"] for d in period_data])
            
            print(f"  • Artesanos activos: {artisans.mean():.1f} (avg) | {artisans.min():.0f}-{artisans.max():.0f} (range)")
            print(f"  • Ingresos (COP): ${revenues.mean():,.0f} (avg) | ${revenues.min():,.0f}-${revenues.max():,.0f} (range)")
            print(f"  • Precio promedio: ${prices.mean():,.0f} (avg)")
            print(f"  • Comercio justo: {fair_trade.mean():.1f}% (avg) | {np.sum(fair_trade > 0)/len(fair_trade)*100:.1f}% de registros")
            print(f"  • Exportaciones: {exports.mean():.1f}% (avg)")

def main() -> None:
    """Genera el CSV con 100,000 registros."""
    
    print(f"Iniciando generación de {TOTAL_RECORDS:,} registros...")
    print(f"Comunidades disponibles: {len(COMMUNITIES)}")
    print(f"Distribución: 40% antes (2021-2023), 60% después (2024-2026)")
    
    # Crear directorio de salida
    output_dir = Path(__file__).parent / "analytics"
    output_dir.mkdir(exist_ok=True)
    output_path = output_dir / "artesania_impacto_100k.csv"
    
    fieldnames = [
        "period", "year", "community", "region", "category",
        "artisans_active", "orders", "pieces_sold", "revenue_cop",
        "avg_price_cop", "fair_trade_premium_pct", "export_share_pct",
    ]
    
    # Semilla para reproducibilidad
    np.random.seed(42)
    
    start_time = time.time()
    all_data = []
    
    # Calcular número de registros por periodo
    records_before = int(TOTAL_RECORDS * 0.4)  # 40,000 registros
    records_after = TOTAL_RECORDS - records_before  # 60,000 registros
    
    print(f"\nDistribución por periodo:")
    print(f"  • Antes de la plataforma: {records_before:,} registros")
    print(f"  • Después de la plataforma: {records_after:,} registros")
    
    # Generar datos "before"
    print("\nGenerando datos 'before'...")
    remaining_before = records_before
    
    while remaining_before > 0:
        # Determinar tamaño del lote actual
        batch_size = min(BATCH_SIZE, remaining_before)
        
        # Seleccionar comunidad aleatoria para este lote
        community_idx = np.random.randint(0, len(COMMUNITIES))
        community_info = COMMUNITIES[community_idx]
        
        # Determinar cuántos registros para esta comunidad
        # (distribución no uniforme - algunas comunidades tienen más datos)
        n_for_community = min(batch_size, np.random.randint(500, 3000))
        
        # Generar datos
        batch_data = generate_community_data(community_info, "before", n_for_community)
        all_data.extend(batch_data)
        
        remaining_before -= len(batch_data)
        
        if len(all_data) % 20_000 == 0:
            print(f"  Generados: {len(all_data):,} registros")
    
    # Generar datos "after"
    print("\nGenerando datos 'after'...")
    remaining_after = records_after
    
    while remaining_after > 0:
        # Determinar tamaño del lote actual
        batch_size = min(BATCH_SIZE, remaining_after)
        
        # Seleccionar comunidad (algunas tienen más crecimiento)
        # Dar más probabilidad a comunidades de regiones costeras (mayor crecimiento)
        weights = []
        for comm in COMMUNITIES:
            if comm["region"] in ["La Guajira", "Atlántico", "Magdalena", "Valle del Cauca"]:
                weights.append(2.0)  # Mayor probabilidad
            elif comm["category"] in ["Mochilas", "Joyas", "Hamacas"]:
                weights.append(1.5)  # Probabilidad media
            else:
                weights.append(1.0)  # Probabilidad base
        
        community_idx = np.random.choice(len(COMMUNITIES), p=np.array(weights)/sum(weights))
        community_info = COMMUNITIES[community_idx]
        
        # Determinar cuántos registros para esta comunidad
        n_for_community = min(batch_size, np.random.randint(1000, 4000))
        
        # Generar datos
        batch_data = generate_community_data(community_info, "after", n_for_community)
        all_data.extend(batch_data)
        
        remaining_after -= len(batch_data)
        
        if len(all_data) % 20_000 == 0:
            print(f"  Generados: {len(all_data):,} registros")
    
    # Mezclar datos para que no estén agrupados por periodo
    np.random.shuffle(all_data)
    
    # Asegurar que tenemos exactamente TOTAL_RECORDS
    all_data = all_data[:TOTAL_RECORDS]
    
    # Escribir al archivo CSV
    print(f"\nEscribiendo {len(all_data):,} registros al archivo CSV...")
    with output_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        
        # Escribir en lotes para mayor eficiencia
        for i in range(0, len(all_data), BATCH_SIZE):
            batch = all_data[i:i + BATCH_SIZE]
            writer.writerows(batch)
            
            if (i // BATCH_SIZE) % 5 == 0:  # Mostrar progreso cada 5 lotes
                print(f"  Escritos: {min(i + BATCH_SIZE, len(all_data)):,} registros")
    
    # Mostrar estadísticas
    print_statistics(all_data)
    
    elapsed_time = time.time() - start_time
    file_size = output_path.stat().st_size / (1024**2)  # Tamaño en MB
    
    print("\n" + "="*60)
    print("GENERACIÓN COMPLETADA")
    print("="*60)
    print(f"Total registros generados: {len(all_data):,}")
    print(f"Archivo generado: {output_path}")
    print(f"Tamaño del archivo: {file_size:.2f} MB")
    print(f"Tiempo total: {elapsed_time:.2f} segundos")
    print(f"Velocidad: {len(all_data)/elapsed_time:,.0f} registros/segundo")
    
    # Mostrar distribución por comunidad
    print("\nDistribución por comunidad (top 10):")
    community_counts = {}
    for record in all_data:
        comm = record["community"]
        community_counts[comm] = community_counts.get(comm, 0) + 1
    
    sorted_communities = sorted(community_counts.items(), key=lambda x: x[1], reverse=True)
    for i, (comm, count) in enumerate(sorted_communities[:10]):
        print(f"  {i+1}. {comm}: {count:,} registros ({count/len(all_data)*100:.1f}%)")
    
    print("\n¡Archivo listo para análisis en Power BI, Excel o Tableau!")


if __name__ == "__main__":
    main()