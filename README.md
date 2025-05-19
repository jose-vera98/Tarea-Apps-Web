# Tarea 2 - Desarrollo de Aplicaciones Web  
Nombre: José Vera  
Curso: CC5002 - 2025-1  

## Descripción del proyecto

En el presente proyecto se encuentra la solucion a la Tarea 2 del curso de Apps Web.

Como no entregue la T1, el formato es muy crudo, y decidi enfocarme mas en las funcionalidades. 

Lamentablemente lei mal el enunciado, por lo que me falto implementar la paginacion en el listado de actividades, pero no me tiempo de agregarlo. 

Espero no sea mucho descuento por esto.

Tambien quiero aclarar que por tiempo o cree ningun evento con sentido, todos eran dummys que hice a la rapida para probar. Puede que haga un commit adicional despues para agregar algunos nuevos a la bbdd, pero en caso que haga algun commit no sera para modificar codigo sino solo el contenido de la base de datos para que se pueda apreciar mejor todas las funcionalidades.

Finalmente menciono que tuve problemas con la base de datos, y que cuando se creo no manejo correctamente las tildes. Asi que los temas con tilde no funcionan ya que no las encuentra en la base de datos. Se que es algo facil de arreglar pero no me dio tiempo. Puede que lo arrgle despues tambien, pero esto no se si ya es mucha modificacion a la entrega.

## Cómo correr el proyecto
Mi recomendacion seria seguir los siguientes pasos, aunque no es necesario al 100% para que funcione.

1. Crear entorno virtual:
   python -m venv venv  
   source venv/bin/activate  (Linux/macOS)  
   venv\Scripts\activate  (Windows)

2. Instalar dependencias:
   pip install -r requirements.txt

3. Crear base de datos `cc5002` y cargar:
   - region-comuna.sql
   - tarea2.sql
   Esot estan ubicados en /static/sql

4. Ejecutar servidor:
   python app.py


## Decisiones importantes

- Se pedia que tuviera de 0 a 5 medios de contacto, por lo que agregue un boton para que se genere hasta 5 campos de contacto. Ademas se pueden repetir los tipos de contacto, ya que por ejemplo puede ser organizado por dos personas y ambas dan su whatsapp
- El contacto es opcional; no se guarda en la base de datos ni se genera una instancia si no se ingresa.
- Se utiliza una sola plantilla dinámica `detalle.html` para todas las actividades.
- Las fotos se suben a /static/fotos/, con renombramiento si el nombre ya existe.
- La paginación no fue implementada por falta de tiempo.

## Validación HTML y CSS

Se detectaron múltiples errores al usar validator.w3.org y jigsaw.w3.org.  
Tras investigar un poco, llegue a la conclusion que la mayoría de los errores eran causados por código Jinja2 (`{{ ... }}`, `{% ... %}`) presente en los archivos `.html`, el cual entiendo que no es comprendido por los validadores al no estar procesado aún.  
No encontre como validar estos html, y probablemente se me haya pasado algun error no relacionado con esto. Igual acepto feedback de como deberia haber manejado estas instancias o si es que Jinja2 no era la forma adecuada de manejar esos html.

## Estructura del proyecto

.
|--- app.py  
|--- models.py  
|--- static/  
|   |--- css/estilos.css  
|   |--- js/validaciones.js  
|   |--- fotos/  
|
|--- templates/  
|   |--- index.html  
|   |--- formulario.html  
|   |--- listado.html  
|   |--- detalle.html 
| 
|---tarea2.sql  
|--- region-comuna.sql  
|--- README.md

## Créditos

José Vera  
CC5002 - Universidad de Chile

PD: no he ido a casi ninguna clase, y todo el proyecto lo hice en base a mi experiencia con desarrollo web y flask. Espero no sea muy distinto de lo esperado.