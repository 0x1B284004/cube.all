# mathematics behind the spinning cube

this document explains the basic mathematics used in the spinning cube script

## three dimensional coordinates

the cube is defined using eight vertices in three dimensional space each vertex has three coordinates x y and z representing position along the x axis y axis and z axis respectively

the cube vertices are positioned at
- back face z equals negative one
- front face z equals positive one
- each face spans from negative one to positive one in both x and y directions

## rotation mathematics

to rotate a point in three dimensional space we use rotation matrices for each axis

### rotation around x axis
when rotating around the x axis the x coordinate stays the same while y and z coordinates change
new y equals old y times cosine of angle minus old z times sine of angle
new z equals old y times sine of angle plus old z times cosine of angle

### rotation around y axis  
when rotating around the y axis the y coordinate stays the same while x and z coordinates change
new x equals old x times cosine of angle plus old z times sine of angle
new z equals negative old x times sine of angle plus old z times cosine of angle

### rotation around z axis
when rotating around the z axis the z coordinate stays the same while x and y coordinates change
new x equals old x times cosine of angle minus old y times sine of angle
new y equals old x times sine of angle plus old y times cosine of angle

## perspective projection

to display three dimensional objects on a two dimensional screen we use perspective projection

the projection formula is
screen x equals three d x times factor times scale plus screen width divided by two
screen y equals three d y times factor times scale plus screen height divided by two

where factor equals distance divided by distance plus three d z
distance is set to five units
scale is set to two hundred

the factor creates perspective by making objects farther away appear smaller
the distance parameter controls the field of view
objects at z equals negative distance would be at infinity

## color mathematics

colors are generated using predefined rgb color arrays with interpolation

### color array
eight predefined colors are used
red orange yellow green blue indigo violet pink

### color interpolation
colors change smoothly by interpolating between adjacent colors in the array
interpolation factor equals current color index minus integer part of color index
new red equals color one red times one minus factor plus color two red times factor
new green equals color one green times one minus factor plus color two green times factor
new blue equals color one blue times one minus factor plus color two blue times factor

color index increases by zero point zero two each frame
when color index reaches the number of colors it resets to zero

## animation mathematics

the animation works by continuously updating rotation angles and color index

rotation angles increase by small amounts each frame
- x angle increases by zero point zero two radians
- y angle increases by zero point zero one five radians  
- z angle increases by zero point zero one radians

color index increases by zero point zero two each frame
when color index reaches the number of colors it resets to zero

the frame rate is controlled by pygame clock at sixty frames per second

## user interaction mathematics

keyboard controls allow manual rotation adjustment
left arrow decreases y angle by zero point zero five radians
right arrow increases y angle by zero point zero five radians
up arrow decreases x angle by zero point zero five radians
down arrow increases x angle by zero point zero five radians

these manual adjustments are added to the automatic rotation values
