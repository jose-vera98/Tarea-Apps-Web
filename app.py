from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from models import Actividad, db, Region, ActividadTema, ContactarPor, Comuna, Foto
from flask import jsonify
from datetime import datetime
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://cc5002:programacionweb@localhost:3306/tarea2'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

UPLOAD_FOLDER = os.path.join('static', 'fotos')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

db.init_app(app)


## Rutas
## Ruta para la portada
@app.route('/')
def index():
    # Ordena por fecha de inicio descendente (las más nuevas primero)
    actividades = Actividad.query.order_by(Actividad.dia_hora_inicio.desc()).limit(5).all()
    return render_template("index.html", actividades=actividades)

## Ruta para el formulario


@app.route('/formulario', methods=['GET', 'POST'])
def mostrar_formulario():
    if request.method == 'POST':
        try:
            # --- Obtener datos base ---
            comuna_id = request.form['comuna']
            sector = request.form['sector']
            nombre = request.form['nombre']
            email = request.form['email']
            celular = request.form['celular']
            descripcion = request.form['descripcion']
            inicio = datetime.strptime(request.form['inicio'], "%Y-%m-%dT%H:%M")

            termino_raw = request.form.get('termino')
            termino = datetime.strptime(termino_raw, "%Y-%m-%dT%H:%M") if termino_raw else None

            # --- Crear Actividad principal ---
            actividad = Actividad(
                comuna_id=comuna_id,
                sector=sector,
                nombre=nombre,
                email=email,
                celular=celular,
                dia_hora_inicio=inicio,
                dia_hora_termino=termino,
                descripcion=descripcion
            )
            db.session.add(actividad)
            db.session.flush()  # Para obtener el ID sin hacer commit aún

            # --- Guardar tema ---
            tema = request.form['tema']
            glosa_otro = request.form.get('tema_otro') if tema == 'otro' else None

            db.session.add(ActividadTema(
                actividad_id=actividad.id,
                tema=tema,
                glosa_otro=glosa_otro
            ))

            # --- Guardar todos los medios de contacto (si existen) ---
            medios = []
            for key in request.form:
                if key.startswith('medio_contacto_'):
                    index = key.split('_')[-1]
                    medio = request.form.get(f'medio_contacto_{index}')
                    identificador = request.form.get(f'id_contacto_{index}')
                    if medio and identificador:
                        medios.append((medio, identificador))

            for medio, identificador in medios:
                db.session.add(ContactarPor(
                    actividad_id=actividad.id,
                    nombre=medio,
                    identificador=identificador
                ))

            fotos = request.files.getlist('foto[]')

            for foto in fotos:
                if foto and allowed_file(foto.filename):
                    filename = secure_filename(foto.filename)
                    ruta = os.path.join(app.config['UPLOAD_FOLDER'], filename)

                    # Evitar sobreescritura si ya existe un archivo con el mismo nombre
                    base, ext = os.path.splitext(filename)
                    contador = 1
                    while os.path.exists(ruta):
                        filename = f"{base}_{contador}{ext}"
                        ruta = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                        contador += 1

                    foto.save(ruta)

                    # Guardar referencia en la base de datos
                    db.session.add(Foto(
                        actividad_id=actividad.id,
                        nombre_archivo=filename,
                        ruta_archivo=f"fotos/{filename}"
                    ))

            # --- Commit final ---
            db.session.commit()
            return redirect(url_for('index'))

        except Exception as e:
            db.session.rollback()
            return f"Error al guardar la actividad: {e}", 500

    # GET: renderizar formulario con regiones
    regiones = Region.query.order_by(Region.nombre).all()
    return render_template('formulario.html', regiones=regiones)




@app.route('/comunas/<int:region_id>')
def comunas_por_region(region_id):
    comunas = Comuna.query.filter_by(region_id=region_id).order_by(Comuna.nombre).all()
    return jsonify([{'id': c.id, 'nombre': c.nombre} for c in comunas])


@app.route('/actividades')
def listado_actividades():
    actividades = Actividad.query.order_by(Actividad.dia_hora_inicio.desc()).all()
    return render_template('listado.html', actividades=actividades)

@app.route('/actividad/<int:id>')
def detalle_actividad(id):
    actividad = Actividad.query.get_or_404(id)
    return render_template('detalle.html', actividad=actividad)




if __name__ == '__main__':
    app.run(debug=True)
