from django.core.management.base import BaseCommand
from backend.models import Category


class Command(BaseCommand):
    help = 'Populate database with predefined categories'

    def handle(self, *args, **options):
        categories = {
            "Eletrônicos": [
                "Smartphones e acessórios",
                "Computadores e tablets",
                "TVs e equipamentos de áudio",
                "Câmeras e drones",
            ],
            "Games & Consoles": [
                "Videogames",
                "Jogos físicos",
                "Acessórios gamers",
            ],
            "Bicicletas e Mobilidade Leve": [
                "Bicicletas",
                "Patinetes elétricos",
                "Skates",
            ],
            "Moda": [
                "Roupas femininas/masculinas",
                "Calçados",
                "Acessórios (bolsas, relógios, joias)",
            ],
            "Casa & Decoração": [
                "Móveis",
                "Eletrodomésticos",
                "Itens de decoração",
            ],
            "Esportes & Lazer": [
                "Equipamentos esportivos",
                "Artigos para camping e aventura",
            ],
            "Infantil": [
                "Brinquedos",
                "Roupas infantis",
                "Carrinhos de bebê/cadeiras",
            ],
            "Instrumentos Musicais": [
                "Guitarras, teclados, baterias",
                "Equipamentos de áudio",
            ],
            "Livros, Filmes & Música": [
                "Livros físicos",
                "Blu-rays, DVDs, vinis, CDs",
            ],
            "Ferramentas & Construção": [
                "Ferramentas elétricas e manuais",
                "Materiais de construção",
            ],
            "Colecionáveis": [
                "Action figures",
                "Moedas, selos, cards",
                "Memorabilia esportiva",
            ],
            "Produtos de Beleza & Saúde": [
                "Cosméticos",
                "Aparelhos de cuidados pessoais",
            ],
            "Pets": [
                "Acessórios, brinquedos e alimentos para animais",
            ],
            "Agro & Jardim": [
                "Sementes, mudas",
                "Equipamentos de jardinagem",
            ],
            "Automotivo Leve": [
                "Peças e acessórios para veículos",
                "Pneus e rodas",
            ],
        }

        created_count = 0
        for parent_name, subcats in categories.items():
            parent, created = Category.objects.get_or_create(name=parent_name, parent=None)
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created parent category: {parent_name}')
                )
            
            for subcat in subcats:
                sub_category, created = Category.objects.get_or_create(name=subcat, parent=parent)
                if created:
                    created_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(f'Created subcategory: {subcat}')
                    )

        if created_count > 0:
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created {created_count} categories!')
            )
        else:
            self.stdout.write(
                self.style.WARNING('All categories already exist in the database.')
            )
