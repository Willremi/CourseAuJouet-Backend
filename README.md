# back_end
# Commande pour lancer le serveur stripe pour sécuriser les paiements:
d'abord verifiez bien que vous avez stripe.exe dans votre dossier sinon téléchargez le ici :

https://github.com/stripe/stripe-cli/releases/tag/v1.7.9
et prenez la version windows_x86_64

lancer un nouveau terminal dans le dossier back_end puis entrez :
.\stripe listen --forward-to localhost:3001/api/webhook

Vous allez peut etre avoir une clé secrete differente que celle déjà mise dans le fichier .env dans ce cas remplacer la par la votre

# Si stripe vous demande de vous logger faire la manip suivante dans le terminal :

  - stripe login
  - appuyez sur entrée cela ouvrira une nouvelle page sur votre navigateur
  - Entrez le login et le mot de passe (vous les retrouverez dans le fichier mailer.config.js situé dans le dossier middleware, ils marchent aussi tu le site de stripe)

Une fois logger essayer de relancer le serveur stripe